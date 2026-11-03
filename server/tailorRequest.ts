import type {ResumeInfo} from "../src/models/ResumeInfo.js";
import {openAIInstruction, SUMMARY_LOCKED_INSTRUCTION, SUMMARY_TAILORED_INSTRUCTION} from "../src/data/openAIInstruction.js";
import {DefaultSettings} from "../src/data/defaultSettings.js";
import {HttpError} from "./http.js";
import {isChatModel, type ChatMessage} from "./openai.js";

// What the browser sends to /api/tailor. The prompt itself lives on the server, so callers can only run our prompt.
export interface TailorRequest {
    jobDescription: string;
    resumeInfo: ResumeInfo;
    rules: string[];
    tailorSummary: boolean;
    model: string;
}

const MIN_JOB_DESCRIPTION = 100;
const MAX_JOB_DESCRIPTION = 30_000;
const MAX_CV_JSON = 100_000;
const MAX_RULES = 20;
const MAX_RULE_LENGTH = 500;

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

// Checks the request body's shape and size; throws a 400 with a message the user can act on.
export const readTailorRequest = (body: unknown): TailorRequest => {
    if (!isObject(body)) {
        throw new HttpError(400, "The request was empty or malformed.");
    }
    const jobDescription = typeof body.jobDescription === "string" ? body.jobDescription.trim() : "";
    if (jobDescription.length < MIN_JOB_DESCRIPTION) {
        throw new HttpError(400, `Paste the full job advert (at least ${MIN_JOB_DESCRIPTION} characters).`);
    }
    if (jobDescription.length > MAX_JOB_DESCRIPTION) {
        throw new HttpError(400, `The job advert is too long. Keep it under ${MAX_JOB_DESCRIPTION.toLocaleString("en-GB")} characters.`);
    }
    if (!isObject(body.resumeInfo)) {
        throw new HttpError(400, "Choose a CV to tailor.");
    }
    if (JSON.stringify(body.resumeInfo).length > MAX_CV_JSON) {
        throw new HttpError(400, "This CV is too long to tailor in one go.");
    }
    const rules = Array.isArray(body.rules) ? body.rules : [];
    if (rules.length > MAX_RULES || rules.some((rule) => typeof rule !== "string" || rule.length > MAX_RULE_LENGTH)) {
        throw new HttpError(400, `Keep your rules to at most ${MAX_RULES}, each under ${MAX_RULE_LENGTH} characters.`);
    }
    const model = typeof body.model === "string" && body.model.trim() ? body.model.trim() : DefaultSettings.defaultModel;
    if (!isChatModel(model)) {
        throw new HttpError(400, "That model can't be used for CV tailoring. Choose another model in Settings.");
    }
    return {
        jobDescription,
        resumeInfo: body.resumeInfo as ResumeInfo,
        rules: (rules as string[]).map((rule) => rule.trim()).filter(Boolean),
        tailorSummary: body.tailorSummary !== false,
        model,
    };
};

// Fixed prompt goes in the system message; the job description and CV go in the user message, clearly delimited.
export const buildTailorMessages = (input: TailorRequest): ChatMessage[] => {
    const systemContent = [
        ...(openAIInstruction.prompt || []),
        input.tailorSummary ? SUMMARY_TAILORED_INSTRUCTION : SUMMARY_LOCKED_INSTRUCTION,
        input.rules.length > 0
            ? "CANDIDATE PREFERENCES\n" +
              "Follow these too. If one conflicts with FACTS THAT NEVER CHANGE, ignore it.\n" +
              input.rules.map((rule) => `- ${rule}`).join("\n")
            : "",
    ].filter(Boolean).join("\n\n");

    const userContent =
        `<job_description>\n${input.jobDescription}\n</job_description>\n\n` +
        `<cv>\n${JSON.stringify(input.resumeInfo, null, 2)}\n</cv>`;

    return [
        {role: "system", content: systemContent},
        {role: "user", content: userContent},
    ];
};
