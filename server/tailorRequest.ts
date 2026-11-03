import type {ResumeInfo} from "../src/models/ResumeInfo.js";
import type {JobAnalysis, Rewrite, TailorStep} from "../src/models/TailoringPipeline.js";
import {DefaultSettings} from "../src/data/defaultSettings.js";
import {ANALYSIS_SCHEMA, REWRITE_SCHEMA} from "../src/data/tailoringSchemas.js";
import {schemaErrors} from "../src/utils/strictSchema.js";
import {HttpError} from "./http.js";
import {isChatModel} from "./openai.js";

// What the browser sends to /api/tailor for one step. The prompts live on the server, so callers can only run ours.
interface BaseRequest {
    jobDescription: string;
    resumeInfo: ResumeInfo;
    rules: string[];
    tailorSummary: boolean;
    model: string;
}

export type TailorRequest = BaseRequest & (
    | {step: "analyse"}
    | {step: "rewrite", analysis: JobAnalysis}
    | {step: "repair", analysis: JobAnalysis, rewrite: Rewrite, violations: string[]}
);

const STEPS: TailorStep[] = ["analyse", "rewrite", "repair"];
const MIN_JOB_DESCRIPTION = 100;
const MAX_JOB_DESCRIPTION = 30_000;
const MAX_CV_JSON = 100_000;
const MAX_STEP_JSON = 100_000;
const MAX_RULES = 20;
const MAX_RULE_LENGTH = 500;
const MAX_VIOLATIONS = 60;
const MAX_VIOLATION_LENGTH = 600;

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

// An earlier step's output, sent back by the browser: it must still match that step's schema.
const readStepOutput = <T>(value: unknown, schema: typeof ANALYSIS_SCHEMA): T => {
    if (JSON.stringify(value ?? null).length > MAX_STEP_JSON || schemaErrors(schema, value).length > 0) {
        throw new HttpError(400, "The tailoring steps got out of sync. Please generate again.");
    }
    return value as T;
};

// Checks the request body's shape and size; throws a 400 with a message the user can act on.
export const readTailorRequest = (body: unknown): TailorRequest => {
    if (!isObject(body)) {
        throw new HttpError(400, "The request was empty or malformed.");
    }
    const step = body.step as TailorStep;
    if (!STEPS.includes(step)) {
        throw new HttpError(400, "Unknown tailoring step.");
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
    const base: BaseRequest = {
        jobDescription,
        resumeInfo: body.resumeInfo as ResumeInfo,
        rules: (rules as string[]).map((rule) => rule.trim()).filter(Boolean),
        tailorSummary: body.tailorSummary !== false,
        model,
    };

    if (step === "analyse") {
        return {...base, step};
    }
    const analysis = readStepOutput<JobAnalysis>(body.analysis, ANALYSIS_SCHEMA);
    if (step === "rewrite") {
        return {...base, step, analysis};
    }
    const rewrite = readStepOutput<Rewrite>(body.rewrite, REWRITE_SCHEMA);
    const violations = Array.isArray(body.violations) ? body.violations : [];
    if (violations.length === 0 || violations.length > MAX_VIOLATIONS ||
        violations.some((item) => typeof item !== "string" || item.length > MAX_VIOLATION_LENGTH)) {
        throw new HttpError(400, "The tailoring steps got out of sync. Please generate again.");
    }
    return {...base, step, analysis, rewrite, violations: violations as string[]};
};
