import {describe, expect, it} from "vitest";
import type {ResumeInfo} from "../models/ResumeInfo";
import type {JobAnalysis, JobRequirement, RequirementResult} from "../models/TailoringPipeline";
import {computeFit, cvFields, findQuote, groupGaps, verifyAnalysis} from "./evidence";

const resume: ResumeInfo = {
    profile: {summary: "Full-stack developer working in C# and React."},
    skills: ["C#", ".NET Core", "React"],
    workExperience: [{
        companyName: "Cenitium", jobTitle: "Software Developer", startMonth: "", startYear: "", endMonth: "", endYear: "",
        duties: ["Promoted from intern to full-time developer after the first year, then led a team of 3 developers."],
    }],
    education: [{institutionName: "Uni", degree: "BSc", course: "Computer Science", startMonth: "", startYear: "", endMonth: "", endYear: "", current: false}],
};

describe("quote verification", () => {
    const fields = cvFields(resume);

    it("accepts verbatim quotes, ignoring case, punctuation and spacing", () => {
        expect(findQuote(fields, "led a team of 3 developers")).toBe("Cenitium");
        expect(findQuote(fields, "Led a team of 3 developers.")).toBe("Cenitium");
        expect(findQuote(fields, "C#, .NET Core")).toBe("Skills");
        expect(findQuote(fields, "Computer Science")).toBe("Uni");
    });

    it("rejects paraphrases, joins across fields and partial words", () => {
        expect(findQuote(fields, "led a team of three engineers")).toBeUndefined();
        expect(findQuote(fields, "led a team of 3 developers. Full-stack developer")).toBeUndefined();
        expect(findQuote(fields, "eact")).toBeUndefined();
    });
});

const requirement = (id: string, overrides: Partial<JobRequirement> = {}): JobRequirement => ({
    id, text: id, priority: "must", category: "technical", evidence: [], ifMissing: {kind: "ask", text: ""}, ...overrides,
});

describe("verifyAnalysis", () => {
    it("drops quotes that aren't in the CV and recomputes strength", () => {
        const analysis: JobAnalysis = {
            job: {title: "", company: "", location: "", salary: "", summary: ""},
            seniority: "lead",
            themes: [1, 2, 3, 4, 5, 6].map((n) => ({name: `T${n}`, jobPhrases: []})),
            requirements: [
                requirement("Leadership", {category: "leadership", evidence: [{quote: "led a team of 3 developers", strength: "partial"}]}),
                requirement("Event-driven", {evidence: [{quote: "built event-driven systems", strength: "strong"}]}),
            ],
            fitStrength: "", fitConcern: "",
        };
        const verified = verifyAnalysis(resume, analysis);
        expect(verified.unverifiedQuotes).toBe(1);
        expect(verified.requirements.map((item) => item.strength)).toEqual(["partial", "none"]);
        expect(verified.analysis.requirements[1].evidence).toEqual([]);
        expect(verified.analysis.themes).toHaveLength(5);
    });
});

const result = (strength: RequirementResult["strength"], overrides: Partial<RequirementResult> = {}): RequirementResult => ({
    id: "R", text: "R", priority: "must", category: "technical", strength, quotes: [], ...overrides,
});

describe("computeFit", () => {
    it("weighs must-haves three times as much as nice-to-haves and partial evidence as half", () => {
        // musts: 3 × (1 + 0.5) = 4.5; nice: 1 × 0 = 0; out of 3 + 3 + 1 = 7
        const fit = computeFit([result("strong"), result("partial"), result("none", {priority: "nice"})], "mid");
        expect(fit.score).toBe(64);
        expect(fit.recommendation).toBe("Worth applying");
    });

    it("rates full evidence a strong fit and uses the model's strength sentence", () => {
        const fit = computeFit([result("strong"), result("strong")], "mid", {fitStrength: "Five years of C#.", fitConcern: ""});
        expect(fit).toEqual({score: 100, recommendation: "Strong fit", reason: "Five years of C#."});
    });

    it("caps a lead role with only partial leadership evidence at Stretch", () => {
        const fit = computeFit([
            result("partial", {category: "leadership"}), result("strong"), result("strong"), result("strong"),
        ], "lead", {fitConcern: "Lead role managing ~10 engineers; your leadership evidence is a team of 3."});
        expect(fit.score).toBe(88);
        expect(fit.recommendation).toBe("Stretch");
        expect(fit.reason).toContain("team of 3");
    });

    it("calls it a poor fit when most must-haves have no evidence", () => {
        const fit = computeFit([result("strong"), result("none"), result("none")], "mid");
        expect(fit.recommendation).toBe("Poor fit");
        expect(fit.reason).toMatch(/doesn't show 2 of the 3 must-haves/);
    });
});

describe("groupGaps", () => {
    it("splits requirements with no evidence into questions and real gaps", () => {
        expect(groupGaps([
            requirement("CI/CD", {ifMissing: {kind: "ask", text: "Have you used CI/CD pipelines? Which tool?"}}),
            requirement("Managing 10 engineers", {ifMissing: {kind: "real", text: "The role manages ~10 engineers."}}),
            requirement("C#", {evidence: [{quote: "C#", strength: "strong"}]}),
        ])).toEqual({ask: ["Have you used CI/CD pipelines? Which tool?"], real: ["The role manages ~10 engineers."]});
    });
});
