
// Types for the three-step tailoring pipeline: analyse the job, rewrite the CV, verify the rewrite.

export type Seniority = "junior" | "mid" | "senior" | "lead";
export type Priority = "must" | "nice";
export type RequirementCategory = "technical" | "leadership" | "domain" | "education" | "other";
export type Strength = "strong" | "partial" | "none";
export type FitRecommendation = "Strong fit" | "Worth applying" | "Stretch" | "Poor fit";

export interface EvidenceQuote {
    quote: string;                      // copied word for word from the CV
    strength: "strong" | "partial";
}

export interface JobRequirement {
    id: string;                         // "R1", "R2", ...
    text: string;                       // in the job's own words
    priority: Priority;
    category: RequirementCategory;
    evidence: EvidenceQuote[];
    ifMissing: {kind: "ask" | "real", text: string};   // a question to ask, or a gap to cover in a cover letter
}

// Step A: what the model returns. The same shape is sent back to the rewrite step, minus any quotes that failed verification.
export interface JobAnalysis {
    job: {title: string, company: string, location: string, salary: string, summary: string};
    seniority: Seniority;
    themes: {name: string, jobPhrases: string[]}[];
    requirements: JobRequirement[];
    fitStrength: string;                // one sentence: the best match
    fitConcern: string;                 // one sentence: the biggest mismatch, or ""
}

export interface FitReport {
    score: number;                      // 0–100, computed in code from the evidence
    recommendation: FitRecommendation;
    reason: string;
}

export interface RequirementResult {
    id: string;
    text: string;
    priority: Priority;
    category: RequirementCategory;
    strength: Strength;
    quotes: (EvidenceQuote & {where: string})[];
}

export interface Gaps {
    ask: string[];                      // "Not in your CV — add it if you have it", as questions
    real: string[];                     // "Real gaps — address in a cover letter"
}

// Step B (and the repair in step C): what the model returns.
export interface RewriteBullet {
    text: string;
    from: number[];                     // indexes of the original bullets in this role it is based on
    why: string;                        // which requirement the change serves; "" if unchanged
}

export interface Rewrite {
    summary: string;
    roles: {index: number, bullets: RewriteBullet[]}[];
    projects: {index: number, bullets: RewriteBullet[]}[];
    projectOrder: number[];
    skills: string[];
    addedSkills: {skill: string, evidence: string}[];
    droppedPoints: {section: string, text: string, reason: string}[];
    improvements: {section: string, issue: string, suggestion: string}[];
}

export type CheckName =
    | "banned-word" | "near-duplicate" | "lost-fact" | "escalation"
    | "new-technology" | "tense" | "too-long" | "too-many-bullets" | "leadership-first";

// One failed check on the rewrite. `bullet` is the bullet's index in its section, when the problem is in one bullet.
export interface Violation {
    check: CheckName;
    where: string;
    bullet?: number;
    message: string;
}

// A fact from the original that the rewrite left out but reported, because the bullet limit forced it out.
export interface KeptOutFact {
    where: string;
    fact: string;
    text: string;
    reason: string;
}

export interface ReportSection {
    kind: "role" | "project";
    index: number;                      // position in the original CV
    title: string;
    original: string[];
    bullets: RewriteBullet[];
}

// Everything the pipeline found, saved with the job application for the fit report and "What changed".
export interface TailoringReport {
    seniority: Seniority;
    themes: JobAnalysis["themes"];
    fit: FitReport;
    requirements: RequirementResult[];
    gaps: Gaps;
    unverifiedQuotes: number;           // evidence quotes dropped because they weren't in the CV
    sections: ReportSection[];
    violations: Violation[];            // checks still failing after the repair; shown to the user
    firstPassViolations: Violation[];   // what the first rewrite got wrong
    repaired: boolean;
    keptOut: KeptOutFact[];
}

// What the user decided about the AI's proposal before saving. Keys come from utils/bulletChoices.ts.
export interface TailoringChoices {
    reverted: string[];                 // bullets ("role:0:2") and "summary" put back to the original
    originalOrder: string[];            // sections ("role:0") shown in the original bullet order
}

export type TailorStep = "analyse" | "rewrite" | "repair";
