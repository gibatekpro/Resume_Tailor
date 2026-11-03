import {HttpError, NOT_CONFIGURED} from "./http.js";

const OPENAI_BASE_URL = "https://api.openai.com/v1";
// Just under the function's maxDuration in vercel.json, so a slow model gets a friendly error instead of a hard kill.
const OPENAI_TIMEOUT_MS = 280_000;

export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface ChatUsage {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
    completion_tokens_details?: {reasoning_tokens?: number};
    prompt_tokens_details?: {cached_tokens?: number};
}

interface ChatCompletionBody {
    model?: string;
    choices?: {message?: {content?: unknown}}[];
    usage?: ChatUsage;
}

const apiKey = () => {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
        console.error("OPENAI_API_KEY is not set.");
        throw new HttpError(500, NOT_CONFIGURED);
    }
    return key;
};

// Reasoning models (o-series, GPT-5) only accept the default temperature.
export const supportsTemperature = (model: string) => !/^(o\d|gpt-5)/.test(model);

// Model ids look like "gpt-4o" or "gpt-5-mini-2025-08-07"; anything else is rejected before it reaches OpenAI.
export const isChatModel = (id: string) =>
    /^(gpt-|o\d|chatgpt-)[a-z0-9.\-:]*$/i.test(id) &&
    !/(audio|realtime|tts|transcribe|image|search|embedding|instruct|moderation|computer-use|codex)/.test(id);

// Chat models from OpenAI's model list, newest first.
export const filterChatModels = (models: {id: string; created: number}[]) =>
    models
        .filter(({id}) => isChatModel(id))
        .sort((a, b) => b.created - a.created)
        .map(({id}) => id);

// Turns an OpenAI error status into a message the user can act on. OpenAI's own message is never passed on.
export const friendlyOpenAIError = (status: number, code?: string): HttpError => {
    if (status === 401 || status === 403) {
        return new HttpError(502, NOT_CONFIGURED);
    }
    if (status === 404 || code === "model_not_found") {
        return new HttpError(400, "That model isn't available to this account. Choose another model in Settings.");
    }
    if (code === "insufficient_quota") {
        return new HttpError(503, "The AI service has run out of credit. Please try again later.");
    }
    if (status === 429) {
        return new HttpError(503, "The AI service is busy right now. Wait a minute and try again.");
    }
    if (code === "context_length_exceeded") {
        return new HttpError(400, "The job advert and CV are too long for this model. Shorten the advert or choose another model.");
    }
    if (status >= 500) {
        return new HttpError(502, "The AI service had a problem. Please try again in a moment.");
    }
    return new HttpError(502, "The AI service couldn't process this request. Try again, or choose another model.");
};

const openAIFetch = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
    let response: Response;
    try {
        response = await fetch(`${OPENAI_BASE_URL}${path}`, {
            ...init,
            headers: {"Content-Type": "application/json", Authorization: `Bearer ${apiKey()}`},
            signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS),
        });
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        const timedOut = error instanceof Error && error.name === "TimeoutError";
        console.error("OpenAI request failed:", timedOut ? "timeout" : "network");
        throw new HttpError(
            504,
            timedOut ? "The AI took too long to answer. Try again, or choose a faster model." : "Couldn't reach the AI service. Please try again.",
        );
    }
    if (!response.ok) {
        const body = await response.json().catch(() => undefined) as {error?: {code?: unknown}} | undefined;
        const code = typeof body?.error?.code === "string" ? body.error.code : undefined;
        console.error("OpenAI error:", response.status, code ?? "");
        throw friendlyOpenAIError(response.status, code);
    }
    return await response.json() as T;
};

export const createChatCompletion = async (model: string, messages: ChatMessage[], responseFormat: object) => {
    const data = await openAIFetch<ChatCompletionBody>("/chat/completions", {
        method: "POST",
        body: JSON.stringify({
            model,
            messages,
            response_format: responseFormat,
            // Low temperature keeps rewrites close to the source CV
            ...(supportsTemperature(model) ? {temperature: 0.3} : {}),
        }),
    });
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
        throw new HttpError(502, "The AI returned an empty answer. Please try again.");
    }
    return {content, model: data.model || model, usage: data.usage || {}};
};

export const listModels = async () => {
    const data = await openAIFetch<{data?: {id: string; created: number}[]}>("/models");
    return filterChatModels(Array.isArray(data?.data) ? data.data : []);
};
