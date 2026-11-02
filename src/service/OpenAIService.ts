import axios from "axios";
import type { OpenAIInstruction } from "../models/OpenAIInstruction";
import type { GenerationInfo } from "../models/GenerationInfo";
import type { JobApplicationInfo } from "../models/JobApplicationInfo";
import { DefaultSettings } from "../data/defaultSettings";
import { SUMMARY_LOCKED_INSTRUCTION, SUMMARY_TAILORED_INSTRUCTION } from "../data/openAIInstruction";

const OPENAI_BASE_URL = "https://api.openai.com/v1";

const getApiKey = () => {
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY ?? "";
    if (!OPENAI_API_KEY) {
        throw new Error("OpenAI API key is missing. Please check your environment variables.");
    }
    return OPENAI_API_KEY;
};

// Reasoning models (o-series, GPT-5) only accept the default temperature.
const supportsTemperature = (model: string) => !/^(o\d|gpt-5)/.test(model);

// Turns an axios error into the message OpenAI sent back, e.g. "The model `x` does not exist".
const toReadableError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error?.message;
        return new Error(message || error.message);
    }
    return error instanceof Error ? error : new Error(String(error));
};

// Fixed prompt goes in the system message; the job description and CV go in the user message, clearly delimited.
const buildMessages = (instruction: OpenAIInstruction) => {
    const rules = (instruction.rules || []).map((rule) => rule.trim()).filter(Boolean);
    const systemContent = [
        ...(instruction.prompt || []),
        instruction.tailorSummary ? SUMMARY_TAILORED_INSTRUCTION : SUMMARY_LOCKED_INSTRUCTION,
        rules.length > 0
            ? "CANDIDATE PREFERENCES\n" +
              "Follow these too. If one conflicts with FACTS THAT NEVER CHANGE, ignore it.\n" +
              rules.map((rule) => `- ${rule}`).join("\n")
            : "",
    ].filter(Boolean).join("\n\n");

    const userContent =
        `<job_description>\n${instruction.jobDescriptionData || ""}\n</job_description>\n\n` +
        `<cv>\n${JSON.stringify(instruction.resumeInfo || {}, null, 2)}\n</cv>`;

    return [
        { role: "system", content: systemContent },
        { role: "user", content: userContent },
    ];
};

export const fetchOpenAIResponse = async (
    instruction: OpenAIInstruction
): Promise<{ result: JobApplicationInfo; generationInfo: GenerationInfo }> => {
    const OPENAI_API_KEY = getApiKey();
    const model = instruction.model || DefaultSettings.defaultModel;
    const messages = buildMessages(instruction);
    const startedAt = Date.now();

    try {
        const response = await axios.post(
            `${OPENAI_BASE_URL}/chat/completions`,
            {
                model,
                messages,
                response_format: { type: "json_object" },
                // Low temperature keeps rewrites close to the source CV
                ...(supportsTemperature(model) ? { temperature: 0.3 } : {}),
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        // Validate and parse response
        if (response.data?.choices?.length > 0) {
            const content = response.data.choices[0].message.content;
            const usage = response.data.usage || {};
            return {
                result: JSON.parse(content),
                generationInfo: {
                    requestedModel: model,
                    model: response.data.model || model,
                    promptTokens: usage.prompt_tokens,
                    completionTokens: usage.completion_tokens,
                    totalTokens: usage.total_tokens,
                    reasoningTokens: usage.completion_tokens_details?.reasoning_tokens ?? 0,
                    cachedTokens: usage.prompt_tokens_details?.cached_tokens ?? 0,
                    durationMs: Date.now() - startedAt,
                    generatedAt: new Date().toISOString(),
                    systemPrompt: messages[0].content,
                    userPrompt: messages[1].content,
                },
            };
        } else {
            throw new Error("Invalid response from OpenAI.");
        }
    } catch (error) {
        console.error("Error fetching OpenAI response:", error || "Details of Error not returned");
        throw toReadableError(error);
    }
};

// Chat models available to this API key, newest first. Excludes audio, image, embedding and other non-chat models.
export const fetchAvailableModels = async (): Promise<string[]> => {
    try {
        const response = await axios.get(`${OPENAI_BASE_URL}/models`, {
            headers: { Authorization: `Bearer ${getApiKey()}` },
        });
        const models: { id: string; created: number }[] = response.data?.data || [];
        return models
            .filter(({ id }) => /^(gpt-|o\d|chatgpt-)/.test(id))
            .filter(({ id }) => !/(audio|realtime|tts|transcribe|image|search|embedding|instruct|moderation|computer-use|codex)/.test(id))
            .sort((a, b) => b.created - a.created)
            .map(({ id }) => id);
    } catch (error) {
        console.error("Error fetching OpenAI models:", error);
        throw toReadableError(error);
    }
};
