import type {GenerationInfo} from "../src/models/GenerationInfo.js";
import {handle, HttpError, json, numberFromEnv} from "../server/http.js";
import {requireUser} from "../server/firebaseAdmin.js";
import {enforceHourlyLimit} from "../server/rateLimit.js";
import {createChatCompletion} from "../server/openai.js";
import {buildTailorMessages, readTailorRequest} from "../server/tailorRequest.js";

const MAX_BODY_BYTES = 300_000;

// POST /api/tailor: tailors the signed-in user's CV to a job advert.
export const POST = handle(async (request) => {
    const uid = await requireUser(request);
    await enforceHourlyLimit(uid, "tailor", numberFromEnv("TAILOR_RATE_LIMIT_PER_HOUR", 40));

    if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
        throw new HttpError(413, "The job advert and CV are too large to send.");
    }
    const input = readTailorRequest(await request.json().catch(() => undefined));
    const messages = buildTailorMessages(input);
    const startedAt = Date.now();

    const {content, model, usage} = await createChatCompletion(input.model, messages, {type: "json_object"});
    let result: unknown;
    try {
        result = JSON.parse(content);
    } catch {
        throw new HttpError(502, "The AI returned an answer we couldn't read. Please try again.");
    }

    const generationInfo: GenerationInfo = {
        requestedModel: input.model,
        model,
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        reasoningTokens: usage.completion_tokens_details?.reasoning_tokens ?? 0,
        cachedTokens: usage.prompt_tokens_details?.cached_tokens ?? 0,
        durationMs: Date.now() - startedAt,
        generatedAt: new Date().toISOString(),
        systemPrompt: messages[0].content,
        userPrompt: messages[1].content,
    };
    return json(200, {result, generationInfo});
});
