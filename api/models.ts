import {handle, json, numberFromEnv} from "../server/http.js";
import {requireAiAccess, requireUser} from "../server/firebaseAdmin.js";
import {enforceHourlyLimit} from "../server/rateLimit.js";
import {listModels} from "../server/openai.js";

// GET /api/models: chat models the server's OpenAI key can use, newest first.
export const GET = handle(async (request) => {
    const uid = await requireUser(request);
    await requireAiAccess(uid);
    await enforceHourlyLimit(uid, "models", numberFromEnv("MODELS_RATE_LIMIT_PER_HOUR", 30));
    return json(200, {models: await listModels()});
});
