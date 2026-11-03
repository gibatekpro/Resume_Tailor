import {describe, expect, it} from "vitest";
import type {GenerationInfo} from "../models/GenerationInfo";
import type {JobAnalysis, Rewrite} from "../models/TailoringPipeline";
import {runTailoringPipeline, type StepCaller, type StepRequest} from "./tailoringPipeline";
import {findNearDuplicates, startsWithPresentTense} from "./tailoringChecks";
import {findBuzzwords} from "./resumeFacts";
import {findTechTerms, mentionsTerm} from "./techTerms";
import {
    CV, DOTNET_ANALYSIS, DOTNET_JOB, DOTNET_REWRITE, LEAD_ANALYSIS, LEAD_FIRST_REWRITE, LEAD_JOB, LEAD_REPAIRED_REWRITE, RULES,
} from "./__fixtures__/tailoringFixtures";

const usage = (step: string): GenerationInfo => ({
    model: "gpt-5", requestedModel: "gpt-5", promptTokens: 1000, completionTokens: 500, totalTokens: 1500,
    durationMs: 1000, generatedAt: "2026-11-03T10:00:00.000Z", systemPrompt: `${step} system`, userPrompt: `${step} user`,
});

// Plays back recorded responses, one per step, and keeps the requests so tests can inspect them.
const playback = (responses: {analyse: JobAnalysis, rewrite: Rewrite, repair?: Rewrite}) => {
    const requests: StepRequest[] = [];
    const callStep = (async (request: StepRequest) => {
        requests.push(request);
        const result = responses[request.step];
        if (!result) throw new Error(`No recorded response for ${request.step}`);
        return {result: structuredClone(result), generationInfo: usage(request.step)};
    }) as StepCaller;
    return {callStep, requests};
};

const run = (job: string, responses: Parameters<typeof playback>[0]) => {
    const recorded = playback(responses);
    const result = runTailoringPipeline(
        {resumeInfo: structuredClone(CV), jobDescription: job, rules: RULES, tailorSummary: true, model: "gpt-5"},
        recorded.callStep,
    );
    return {result, requests: recorded.requests};
};

const allCvText = JSON.stringify(CV);

describe("Lead Software Engineer C# .NET – FinTech (the reported run)", () => {
    const lead = run(LEAD_JOB, {analyse: LEAD_ANALYSIS, rewrite: LEAD_FIRST_REWRITE, repair: LEAD_REPAIRED_REWRITE});

    it("catches every failure from the reported run in the first rewrite, and repairs once", async () => {
        const application = await lead.result;
        const first = application.tailoringReport!.firstPassViolations;
        const firstChecks = new Set(first.map((violation) => violation.check));
        expect([...firstChecks].sort()).toEqual(
            ["banned-word", "leadership-first", "lost-fact", "near-duplicate", "new-technology", "tense"].sort(),
        );
        expect(first.some((violation) => violation.check === "lost-fact" && violation.message.includes('"promoted"'))).toBe(true);
        expect(first.filter((violation) => violation.check === "tense").map((violation) => violation.bullet)).toEqual([2, 3, 4]);

        expect(lead.requests.map((request) => request.step)).toEqual(["analyse", "rewrite", "repair"]);
        const repair = lead.requests[2] as StepRequest & {step: "repair"};
        expect(repair.violations.join("\n")).toContain('"promoted"');
        expect(application.tailoringReport!.repaired).toBe(true);
        expect(application.tailoringReport!.violations).toEqual([]);
    });

    it("sends the rewrite only verified evidence", async () => {
        await lead.result;
        const rewrite = lead.requests[1] as StepRequest & {step: "rewrite"};
        const eventDriven = rewrite.analysis.requirements.find((requirement) => requirement.id === "R4")!;
        expect(eventDriven.evidence).toEqual([]);
        expect((await lead.result).tailoringReport!.unverifiedQuotes).toBe(1);
    });

    it("keeps the promotion", async () => {
        const duties = (await lead.result).resumeInfo!.workExperience![0].duties;
        expect(duties.some((duty) => /promoted from intern to full-time developer/i.test(duty))).toBe(true);
    });

    it("puts leadership and mentoring first, and in the summary", async () => {
        const resume = (await lead.result).resumeInfo!;
        const [first, second] = resume.workExperience![0].duties;
        expect(first).toMatch(/\bled a team of 3 developers\b/i);
        expect(second).toMatch(/^Mentored 3 placement-year students/);
        expect(resume.profile!.summary).toMatch(/\bled a team of 3\b/);
        expect(resume.profile!.summary).toMatch(/\bmentored\b/);
    });

    it("has no near-duplicate Cenitium bullets", async () => {
        expect(findNearDuplicates((await lead.result).resumeInfo!.workExperience![0].duties)).toEqual([]);
    });

    it("keeps completed work in the past tense", async () => {
        const duties = (await lead.result).resumeInfo!.workExperience![0].duties;
        expect(duties.some((duty) => duty.startsWith("Modernised"))).toBe(true);
        expect(duties.some((duty) => duty.startsWith("Automated"))).toBe(true);
        expect(duties.filter((duty) => /^(Modernise|Automate|Deliver)\b/.test(duty))).toEqual([]);
        expect(duties.filter(startsWithPresentTense)).toEqual([duties[2]]);   // "Build and maintain": an ongoing duty
    });

    it("uses no banned words and no technologies the CV doesn't name", async () => {
        const application = await lead.result;
        expect(findBuzzwords(application.resumeInfo!)).toEqual([]);
        const output = JSON.stringify([application.resumeInfo!.profile, application.resumeInfo!.workExperience, application.resumeInfo!.projects]);
        expect(findTechTerms(output).filter((term) => !mentionsTerm(allCvText, term))).toEqual([]);
        expect(application.resumeInfo!.skills).not.toContain("Event-driven architecture");
        // The first rewrite claimed it; the check caught it before the repair.
        expect(application.tailoringReport!.firstPassViolations.find((violation) => violation.check === "new-technology")?.message)
            .toMatch(/event-driven/);
    });

    it("rates the fit as a stretch, with a reason", async () => {
        const {fit, gaps} = (await lead.result).tailoringReport!;
        expect(["Stretch", "Poor fit"]).toContain(fit.recommendation);
        expect(fit.score).toBe(50);
        expect(fit.reason).toBe("Lead role managing ~10 engineers; your leadership evidence is a team of 3.");
        expect(gaps.ask).toEqual(expect.arrayContaining([expect.stringMatching(/CI\/CD/), expect.stringMatching(/Terraform/)]));
        expect(gaps.real).toContain("The role leads around 10 engineers; your CV shows leading a team of 3.");
    });

    it("keeps facts the AI may not change, and fills in the job details", async () => {
        const application = await lead.result;
        expect(application.resumeInfo!.workExperience!.map((role) => [role.companyName, role.jobTitle, role.startYear]))
            .toEqual(CV.workExperience!.map((role) => [role.companyName, role.jobTitle, role.startYear]));
        expect(application.resumeInfo!.education).toEqual(CV.education);
        expect(application.openAIJobTitle).toBe("Lead Software Engineer C# .NET");
        expect(application.openAIDocumentTitle).toBe("tony-sample");
        expect(application.generationInfo!.totalTokens).toBe(4500);
        expect(application.generationInfo!.steps!.map((step) => step.step)).toEqual(["analyse", "rewrite", "repair"]);
    });
});

describe(".NET Developer (mid-level, a strong fit)", () => {
    const dotnet = run(DOTNET_JOB, {analyse: DOTNET_ANALYSIS, rewrite: DOTNET_REWRITE});

    it("rates the fit highly", async () => {
        const {fit} = (await dotnet.result).tailoringReport!;
        expect(fit.recommendation).toBe("Strong fit");
        expect(fit.score).toBeGreaterThanOrEqual(75);
    });

    it("needs no repair when the rewrite passes every check", async () => {
        const application = await dotnet.result;
        expect(dotnet.requests.map((request) => request.step)).toEqual(["analyse", "rewrite"]);
        expect(application.tailoringReport!.violations).toEqual([]);
    });

    it("leads with the .NET work and reports the point it had to drop", async () => {
        const application = await dotnet.result;
        expect(application.resumeInfo!.workExperience![0].duties[0]).toMatch(/React and \.NET features/);
        expect(application.tailoringReport!.keptOut.map((item) => item.fact)).toEqual(expect.arrayContaining(["mentored", "3 placement"]));
    });
});
