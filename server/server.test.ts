import {describe, expect, it} from "vitest";
import {applyRateLimit} from "./rateLimit.js";
import {filterChatModels, friendlyOpenAIError, isChatModel} from "./openai.js";
import {readTailorRequest} from "./tailorRequest.js";
import {buildStepPrompt, formatCv} from "./prompts.js";
import {HttpError} from "./http.js";

const HOUR = 60 * 60 * 1000;

describe("applyRateLimit", () => {
    it("starts a new window on the first request", () => {
        expect(applyRateLimit(undefined, 1000, 3, HOUR)).toEqual({allowed: true, next: {windowStart: 1000, count: 1}});
    });

    it("counts requests inside the window", () => {
        expect(applyRateLimit({windowStart: 0, count: 2}, 10, 3, HOUR)).toEqual({allowed: true, next: {windowStart: 0, count: 3}});
    });

    it("blocks once the limit is reached and says when to retry", () => {
        const result = applyRateLimit({windowStart: 0, count: 3}, HOUR - 90_000, 3, HOUR);
        expect(result.allowed).toBe(false);
        expect(result.retryAfterSeconds).toBe(90);
    });

    it("resets after the window ends", () => {
        expect(applyRateLimit({windowStart: 0, count: 3}, HOUR, 3, HOUR)).toEqual({allowed: true, next: {windowStart: HOUR, count: 1}});
    });
});

describe("friendlyOpenAIError", () => {
    it("never passes on OpenAI's own wording", () => {
        for (const [status, code] of [[401], [404], [429, "insufficient_quota"], [429], [400, "context_length_exceeded"], [500], [400]] as const) {
            const error = friendlyOpenAIError(status, code);
            expect(error).toBeInstanceOf(HttpError);
            expect(error.message).not.toMatch(/openai|api key|sk-/i);
        }
    });

    it("tells the user what to do for common failures", () => {
        expect(friendlyOpenAIError(404).message).toMatch(/choose another model/i);
        expect(friendlyOpenAIError(429, "insufficient_quota").message).toMatch(/credit/i);
        expect(friendlyOpenAIError(429).status).toBe(503);
    });
});

describe("chat model filter", () => {
    it("keeps chat models newest first and drops the rest", () => {
        expect(filterChatModels([
            {id: "gpt-4o", created: 1},
            {id: "gpt-5", created: 3},
            {id: "text-embedding-3-small", created: 4},
            {id: "gpt-4o-realtime-preview", created: 5},
            {id: "o3-mini", created: 2},
        ])).toEqual(["gpt-5", "o3-mini", "gpt-4o"]);
    });

    it("rejects ids that aren't chat models", () => {
        expect(isChatModel("gpt-5-mini-2025-08-07")).toBe(true);
        expect(isChatModel("dall-e-3")).toBe(false);
        expect(isChatModel("gpt-4o/../../files")).toBe(false);
    });
});

describe("readTailorRequest", () => {
    const valid = {
        step: "analyse",
        jobDescription: "x".repeat(150),
        resumeInfo: {profile: {firstName: "Ada"}},
        rules: [" Use British English. ", ""],
        model: "gpt-4o",
    };
    const analysis = {
        job: {title: "Developer", company: "Acme", location: "", salary: "", summary: "Builds things."},
        seniority: "mid",
        themes: [{name: "C#", jobPhrases: ["C# .NET"]}],
        requirements: [{
            id: "R1", text: "C#", priority: "must", category: "technical",
            evidence: [{quote: "Built APIs in C#", strength: "strong"}],
            ifMissing: {kind: "ask", text: ""},
        }],
        fitStrength: "", fitConcern: "",
    };

    it("accepts a valid request and tidies the rules", () => {
        const request = readTailorRequest(valid);
        expect(request.rules).toEqual(["Use British English."]);
        expect(request.tailorSummary).toBe(true);
    });

    it("rejects an unknown step, a short job advert, a missing CV and an unknown model", () => {
        expect(() => readTailorRequest({...valid, step: "anything"})).toThrow(/step/);
        expect(() => readTailorRequest({...valid, jobDescription: "too short"})).toThrow(/at least 100/);
        expect(() => readTailorRequest({...valid, resumeInfo: undefined})).toThrow(/CV/);
        expect(() => readTailorRequest({...valid, model: "dall-e-3"})).toThrow(/model/);
        expect(() => readTailorRequest(null)).toThrow(HttpError);
    });

    it("needs a well-formed analysis for the rewrite step and violations for the repair step", () => {
        expect(readTailorRequest({...valid, step: "rewrite", analysis}).step).toBe("rewrite");
        expect(() => readTailorRequest({...valid, step: "rewrite", analysis: {...analysis, seniority: "boss"}})).toThrow(/out of sync/);
        expect(() => readTailorRequest({...valid, step: "repair", analysis, rewrite: {}, violations: ["x"]})).toThrow(/out of sync/);
    });

    it("puts the fixed prompt in the system message and the user's data in the user message", () => {
        const analyse = buildStepPrompt(readTailorRequest(valid));
        expect(analyse.messages[0].content).toContain("EVIDENCE");
        expect(analyse.messages[1].content).toContain("<job_description>");
        expect(analyse.responseFormat).toMatchObject({type: "json_schema", json_schema: {name: "job_analysis", strict: true}});

        const rewrite = buildStepPrompt(readTailorRequest({...valid, step: "rewrite", analysis}));
        expect(rewrite.messages[0].content).toContain("KEEP EVERY FACT");
        expect(rewrite.messages[0].content).toContain("- Use British English.");
        expect(rewrite.messages[1].content).toContain('R1 [must, technical] C#: strong');
        expect(rewrite.messages[1].content).toContain('Name: Ada');
    });
});

describe("formatCv", () => {
    it("numbers roles and bullets so the model can refer to them", () => {
        const text = formatCv({
            workExperience: [{
                companyName: "Cenitium", jobTitle: "Software Developer", duties: ["Built things", "Fixed things"],
                startMonth: "Sep", startYear: "2021", endMonth: "", endYear: "", current: true,
            }],
        });
        expect(text).toContain("[Role 0] Software Developer at Cenitium, Sep 2021 – present (current role)");
        expect(text).toContain("[1] Fixed things");
    });
});
