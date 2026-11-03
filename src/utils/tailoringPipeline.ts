import type {ResumeInfo} from "../models/ResumeInfo";
import type {GenerationInfo} from "../models/GenerationInfo";
import type {JobApplicationInfo} from "../models/JobApplicationInfo";
import type {JobAnalysis, Rewrite, TailoringReport, TailorStep, Violation} from "../models/TailoringPipeline";
import {computeFit, groupGaps, verifyAnalysis} from "./evidence";
import {buildSections, rewriteToResume, sanitiseRewrite} from "./applyRewrite";
import {runChecks} from "./tailoringChecks";
import {describeChanges, lockResumeFacts, readImprovements, verifyAddedSkills} from "./resumeFacts";
import {settleSeniority} from "./seniority";
import {findTechTerms} from "./techTerms";

export interface TailorInput {
    resumeInfo: ResumeInfo;
    jobDescription: string;
    rules: string[];
    tailorSummary: boolean;
    model: string;
}

export type StepRequest = TailorInput & (
    | {step: "analyse"}
    | {step: "rewrite", analysis: JobAnalysis}
    | {step: "repair", analysis: JobAnalysis, rewrite: Rewrite, violations: string[]}
);

export interface StepResponse<T> {
    result: T;
    generationInfo: GenerationInfo;
}

// Makes one model call. The app passes the real /api/tailor call; tests pass recorded responses.
export interface StepCaller {
    (request: StepRequest & {step: "analyse"}): Promise<StepResponse<JobAnalysis>>;
    (request: StepRequest & {step: "rewrite" | "repair"}): Promise<StepResponse<Rewrite>>;
}

const documentTitle = (resume: ResumeInfo, company: string) =>
    [resume.profile?.firstName, resume.profile?.lastName, company]
        .filter(Boolean).join("-").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const sumOf = (infos: GenerationInfo[], key: "promptTokens" | "completionTokens" | "totalTokens" | "reasoningTokens" | "cachedTokens" | "durationMs") =>
    infos.reduce((total, info) => total + (info[key] ?? 0), 0);

const combineGenerationInfo = (calls: {step: TailorStep, info: GenerationInfo}[]): GenerationInfo => {
    const infos = calls.map((call) => call.info);
    const rewrite = calls.find((call) => call.step === "rewrite")?.info ?? infos[infos.length - 1];
    return {
        requestedModel: rewrite.requestedModel,
        model: rewrite.model,
        promptTokens: sumOf(infos, "promptTokens"),
        completionTokens: sumOf(infos, "completionTokens"),
        totalTokens: sumOf(infos, "totalTokens"),
        reasoningTokens: sumOf(infos, "reasoningTokens"),
        cachedTokens: sumOf(infos, "cachedTokens"),
        durationMs: sumOf(infos, "durationMs"),
        generatedAt: infos[infos.length - 1].generatedAt,
        systemPrompt: rewrite.systemPrompt,
        userPrompt: rewrite.userPrompt,
        steps: calls.map(({step, info}) => ({
            step,
            model: info.model,
            promptTokens: info.promptTokens ?? 0,
            completionTokens: info.completionTokens ?? 0,
            reasoningTokens: info.reasoningTokens ?? 0,
            cachedTokens: info.cachedTokens ?? 0,
            durationMs: info.durationMs ?? 0,
        })),
    };
};

export const describeViolation = (violation: Violation) => `[${violation.check}] ${violation.where}: ${violation.message}`;

// Analyse the job, rewrite the CV using the evidence, check the rewrite in code and repair it once if needed.
export const runTailoringPipeline = async (
    input: TailorInput,
    callStep: StepCaller,
    onProgress: (message: string) => void = () => {},
): Promise<JobApplicationInfo> => {
    const original = input.resumeInfo;
    const calls: {step: TailorStep, info: GenerationInfo}[] = [];

    // Step A: analyse the job and map its requirements to the CV, keeping only quotes that are really in the CV.
    // The seniority is checked against the years the advert asks for and who the role works under.
    onProgress("Reading the job advert...");
    const analysed = await callStep({...input, step: "analyse"});
    calls.push({step: "analyse", info: analysed.generationInfo});
    const verified = verifyAnalysis(original, analysed.result);
    const analysis = {...verified.analysis, seniority: settleSeniority(input.jobDescription, verified.analysis)};
    const fit = computeFit(verified.requirements, analysis.seniority, analysis);

    // Step B: rewrite, guided by the verified evidence.
    onProgress("Tailoring your CV...");
    const rewritten = await callStep({...input, step: "rewrite", analysis});
    calls.push({step: "rewrite", info: rewritten.generationInfo});

    // The technologies the job names, including any of the CV's own skills, to judge which project bullets matter most.
    const jobTerms = findTechTerms(input.jobDescription, original.skills || []);
    const evaluate = (raw: Rewrite) => {
        const rewrite = sanitiseRewrite(original, raw);
        const skills = verifyAddedSkills(original, rewrite.addedSkills);
        const checks = runChecks(original, rewrite, {
            rules: input.rules,
            addedSkills: skills.accepted.map((added) => added.skill),
            tailorSummary: input.tailorSummary,
            seniority: analysis.seniority,
            jobTerms,
        });
        return {rewrite, skills, ...checks};
    };

    // Step C: check in code; if anything fails, ask for one corrected rewrite and check again.
    onProgress("Checking the rewrite...");
    const first = evaluate(rewritten.result);
    let final = first;
    if (first.violations.length > 0) {
        onProgress(`Fixing ${first.violations.length} problem${first.violations.length === 1 ? "" : "s"}...`);
        const repaired = await callStep({
            ...input,
            step: "repair",
            analysis,
            rewrite: first.rewrite,
            violations: first.violations.map(describeViolation),
        });
        calls.push({step: "repair", info: repaired.generationInfo});
        const second = evaluate(repaired.result);
        // Keep the repair unless it made things worse.
        final = second.violations.length <= first.violations.length ? second : first;
    }

    const {rewrite, skills} = final;
    const tailored = lockResumeFacts(original, rewriteToResume(original, rewrite), {
        addedSkills: skills.accepted,
        allowSummary: input.tailorSummary,
    });

    const report: TailoringReport = {
        seniority: analysis.seniority,
        themes: analysis.themes,
        fit,
        requirements: verified.requirements,
        gaps: groupGaps(analysis.requirements),
        unverifiedQuotes: verified.unverifiedQuotes,
        sections: buildSections(original, rewrite),
        violations: final.violations,
        firstPassViolations: first.violations,
        repaired: calls.some((call) => call.step === "repair"),
        keptOut: final.keptOut,
    };

    return {
        openAIDocumentTitle: documentTitle(original, analysis.job.company),
        openAIJobTitle: analysis.job.title,
        openAIJobCompanyName: analysis.job.company,
        openAIExpectedSalary: analysis.job.salary,
        openAIJobLocation: analysis.job.location,
        openAISimpleJobDescription: analysis.job.summary,
        openAIGaps: verified.requirements.filter((item) => item.strength === "none").map((item) => item.text),
        openAIImprovements: readImprovements(rewrite.improvements),
        generationInfo: combineGenerationInfo(calls),
        tailoringChanges: describeChanges(original, tailored, skills.accepted, skills.rejected),
        tailoringReport: report,
        resumeInfo: tailored,
    };
};
