
// What was sent to the AI for one generation, and what it cost. Saved with the job application.
export interface GenerationInfo {
    requestedModel?: string;
    model?: string;              // model that actually answered, as reported by the API
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    reasoningTokens?: number;
    cachedTokens?: number;
    durationMs?: number;
    generatedAt?: string;
    systemPrompt?: string;
    userPrompt?: string;
}
