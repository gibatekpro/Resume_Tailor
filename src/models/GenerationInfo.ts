
// Tokens and time for one model call in the tailoring pipeline.
export interface StepUsage {
    step: string;
    model?: string;
    promptTokens?: number;
    completionTokens?: number;
    reasoningTokens?: number;
    cachedTokens?: number;
    durationMs?: number;
}

// What was sent to the AI for one generation, and what it cost. Saved with the job application.
// Token counts and time are totals over every step; the prompts are the rewrite step's.
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
    steps?: StepUsage[];
}
