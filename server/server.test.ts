import {describe, expect, it} from "vitest";
import {applyRateLimit} from "./rateLimit.js";
import {filterChatModels, friendlyOpenAIError, isChatModel} from "./openai.js";
import {buildTailorMessages, readTailorRequest} from "./tailorRequest.js";
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
        jobDescription: "x".repeat(150),
        resumeInfo: {profile: {firstName: "Ada"}},
        rules: [" Use British English. ", ""],
        model: "gpt-4o",
    };

    it("accepts a valid request and tidies the rules", () => {
        const request = readTailorRequest(valid);
        expect(request.rules).toEqual(["Use British English."]);
        expect(request.tailorSummary).toBe(true);
    });

    it("rejects a short job advert, a missing CV and an unknown model", () => {
        expect(() => readTailorRequest({...valid, jobDescription: "too short"})).toThrow(/at least 100/);
        expect(() => readTailorRequest({...valid, resumeInfo: undefined})).toThrow(/CV/);
        expect(() => readTailorRequest({...valid, model: "dall-e-3"})).toThrow(/model/);
        expect(() => readTailorRequest(null)).toThrow(HttpError);
    });

    it("puts the fixed prompt in the system message and the user's data in the user message", () => {
        const [system, user] = buildTailorMessages(readTailorRequest(valid));
        expect(system.content).toContain("FACTS THAT NEVER CHANGE");
        expect(system.content).toContain("- Use British English.");
        expect(user.content).toContain("<job_description>");
        expect(user.content).toContain('"firstName": "Ada"');
    });
});
