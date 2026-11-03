import type {GenerationInfo} from "../src/models/GenerationInfo.js";
import {schemaErrors} from "../src/utils/strictSchema.js";
import {handle, HttpError, json, numberFromEnv, readJsonBody} from "../server/http.js";
import {requireAiAccess, requireUser} from "../server/firebaseAdmin.js";
import {enforceHourlyLimit} from "../server/rateLimit.js";
import {createChatCompletion} from "../server/openai.js";
import {readTailorRequest} from "../server/tailorRequest.js";
import {buildStepPrompt, STEP_SCHEMAS} from "../server/prompts.js";

const MAX_BODY_BYTES = 400_000;

// POST /api/tailor: runs one step of the tailoring pipeline (analyse, rewrite or repair) for the signed-in user.
export const POST = handle(async (request) => {
    const uid = await requireUser(request);
    await requireAiAccess(uid);
    await enforceHourlyLimit(uid, "tailor", numberFromEnv("TAILOR_RATE_LIMIT_PER_HOUR", 40));

    const input = readTailorRequest(await readJsonBody(request, MAX_BODY_BYTES));
    const {messages, responseFormat} = buildStepPrompt(input);
    const startedAt = Date.now();

    const {content, model, usage} = await createChatCompletion(input.model, messages, responseFormat);
    let result: unknown;
    try {
        result = JSON.parse(content);
    } catch {
        throw new HttpError(502, "The AI returned an answer we couldn't read. Please try again.");
    }
    // Structured outputs should guarantee the shape; check anyway. Only field paths are logged, never content.
    const errors = schemaErrors(STEP_SCHEMAS[input.step], result);
    if (errors.length > 0) {
        console.error(`Step ${input.step} answer didn't match its schema:`, errors.slice(0, 5).map((error) => error.split(":")[0]).join(", "));
        throw new HttpError(502, "The AI's answer was incomplete. Please try again, or choose another model.");
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
