import {describe, expect, it} from "vitest";
import {applyRateLimit} from "./rateLimit.js";
import {DEFAULT_ALLOWED_MODELS, filterChatModels, friendlyOpenAIError, isChatModel, parseAllowedModels} from "./openai.js";
import {readTailorRequest} from "./tailorRequest.js";
import {buildStepPrompt, formatCv} from "./prompts.js";
import {HttpError, readJsonBody} from "./http.js";

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
    it("keeps allowed chat models newest first and drops the rest", () => {
        expect(filterChatModels([
            {id: "gpt-4o", created: 1},
            {id: "gpt-5", created: 3},
            {id: "gpt-5-pro", created: 6},
            {id: "text-embedding-3-small", created: 4},
            {id: "gpt-4o-realtime-preview", created: 5},
            {id: "o3-mini", created: 2},
        ], ["gpt-5", "gpt-5-pro", "o3-mini", "gpt-4o", "text-embedding-3-small"])).toEqual(["gpt-5-pro", "gpt-5", "o3-mini", "gpt-4o"]);
        expect(filterChatModels([{id: "gpt-5-pro", created: 6}, {id: "gpt-5", created: 3}])).toEqual(["gpt-5"]);
    });

    it("rejects ids that aren't chat models", () => {
        expect(isChatModel("gpt-5-mini-2025-08-07")).toBe(true);
        expect(isChatModel("dall-e-3")).toBe(false);
        expect(isChatModel("gpt-4o/../../files")).toBe(false);
    });
});

describe("model allowlist", () => {
    it("reads ALLOWED_MODELS, ignoring blanks and non-chat models, and falls back to the default list", () => {
        expect(parseAllowedModels(" gpt-5, gpt-5-mini ,,dall-e-3")).toEqual(["gpt-5", "gpt-5-mini"]);
        expect(parseAllowedModels("")).toEqual(DEFAULT_ALLOWED_MODELS);
        expect(parseAllowedModels(undefined)).toEqual(DEFAULT_ALLOWED_MODELS);
        expect(DEFAULT_ALLOWED_MODELS.some((model) => model.includes("pro"))).toBe(false);
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

    it("rejects an unknown step, a short job advert, a missing CV and a model that isn't allowed", () => {
        expect(() => readTailorRequest({...valid, step: "anything"})).toThrow(/step/);
        expect(() => readTailorRequest({...valid, jobDescription: "too short"})).toThrow(/at least 100/);
        expect(() => readTailorRequest({...valid, resumeInfo: undefined})).toThrow(/CV/);
        expect(() => readTailorRequest({...valid, model: "dall-e-3"})).toThrow(/model/);
        expect(() => readTailorRequest({...valid, model: "gpt-5-pro"})).toThrow(/isn't enabled/);
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

describe("readJsonBody", () => {
    // A streamed body sends no content-length, like a chunked request.
    const streamed = (text: string, chunkSize = 10) => new Request("http://x/api/tailor", {
        method: "POST",
        body: new ReadableStream({
            start(controller) {
                for (let i = 0; i < text.length; i += chunkSize) controller.enqueue(new TextEncoder().encode(text.slice(i, i + chunkSize)));
                controller.close();
            },
        }),
        duplex: "half",
    } as RequestInit);

    it("parses a body under the cap", async () => {
        expect(await readJsonBody(new Request("http://x", {method: "POST", body: '{"a":1}'}), 100)).toEqual({a: 1});
        expect(await readJsonBody(streamed('{"step":"analyse"}'), 100)).toEqual({step: "analyse"});
    });

    it("rejects a declared content-length over the cap without reading", async () => {
        const request = new Request("http://x", {method: "POST", body: "{}", headers: {"content-length": "5000"}});
        await expect(readJsonBody(request, 100)).rejects.toMatchObject({status: 413});
        expect(request.bodyUsed).toBe(false);
    });

    it("cuts off a chunked body with no content-length once it passes the cap", async () => {
        const request = streamed(JSON.stringify({padding: "x".repeat(500)}));
        expect(request.headers.get("content-length")).toBeNull();
        await expect(readJsonBody(request, 100)).rejects.toMatchObject({status: 413});
    });

    it("returns undefined for an empty or malformed body", async () => {
        expect(await readJsonBody(new Request("http://x", {method: "POST"}), 100)).toBeUndefined();
        expect(await readJsonBody(new Request("http://x", {method: "POST", body: "not json"}), 100)).toBeUndefined();
    });
});
