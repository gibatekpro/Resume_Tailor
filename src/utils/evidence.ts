import type {ResumeInfo} from "../models/ResumeInfo";
import type {
    EvidenceQuote, FitRecommendation, FitReport, Gaps, JobAnalysis, JobRequirement, RequirementResult, Seniority, Strength,
} from "../models/TailoringPipeline";
import {normaliseText} from "./text";

// Every piece of text in the CV, labelled with where it came from. A quote must sit inside one of these.
export const cvFields = (resume: ResumeInfo) => {
    const fields: {where: string, text?: string}[] = [
        {where: "Summary", text: resume.profile?.summary},
        {where: "Profile", text: resume.profile?.profession},
        {where: "Skills", text: (resume.skills || []).join(", ")},
        ...(resume.skills || []).map((text) => ({where: "Skills", text})),
        ...(resume.workExperience || []).flatMap((role) =>
            [role.jobTitle, role.description, ...(role.duties || [])].map((text) => ({where: role.companyName, text}))),
        ...(resume.projects || []).flatMap((project) =>
            [project.projectName, project.role, project.description, ...(project.projectDetails || [])].map((text) => ({where: project.projectName, text}))),
        ...(resume.education || []).flatMap((education) =>
            [education.degree, education.course, education.institutionName, education.class].map((text) => ({where: education.institutionName, text}))),
        ...(resume.languages || []).map((language) => ({where: "Languages", text: language.name})),
    ];
    return fields
        .filter((field): field is {where: string, text: string} => !!field.text?.trim())
        .map((field) => ({where: field.where, text: normaliseText(field.text)}));
};

// Where a quote appears word for word in the CV (ignoring case, punctuation and spacing), or undefined if it doesn't.
export const findQuote = (fields: ReturnType<typeof cvFields>, quote: string) => {
    const needle = normaliseText(quote);
    if (needle.trim().length < 2) {
        return undefined;
    }
    return fields.find((field) => field.text.includes(needle))?.where;
};

export const strengthOf = (evidence: EvidenceQuote[]): Strength =>
    evidence.some((item) => item.strength === "strong") ? "strong" : evidence.length > 0 ? "partial" : "none";

// Drops every evidence quote that isn't really in the CV, so a strength can only rest on the candidate's own words.
export const verifyAnalysis = (resume: ResumeInfo, analysis: JobAnalysis) => {
    const fields = cvFields(resume);
    let unverifiedQuotes = 0;
    const results: RequirementResult[] = [];
    const requirements: JobRequirement[] = analysis.requirements.map((requirement) => {
        const quotes = requirement.evidence.flatMap((item) => {
            const where = findQuote(fields, item.quote);
            if (!where) {
                unverifiedQuotes++;
                return [];
            }
            return [{...item, where}];
        });
        results.push({
            id: requirement.id,
            text: requirement.text,
            priority: requirement.priority,
            category: requirement.category,
            strength: strengthOf(quotes),
            quotes,
        });
        return {...requirement, evidence: quotes.map(({quote, strength}) => ({quote, strength}))};
    });
    return {
        analysis: {...analysis, themes: analysis.themes.slice(0, 5), requirements},
        requirements: results,
        unverifiedQuotes,
    };
};

const PRIORITY_WEIGHT = {must: 3, nice: 1};
const STRENGTH_CREDIT = {strong: 1, partial: 0.5, none: 0};
const RANK: FitRecommendation[] = ["Poor fit", "Stretch", "Worth applying", "Strong fit"];

const atMost = (recommendation: FitRecommendation, cap: FitRecommendation) =>
    RANK[Math.min(RANK.indexOf(recommendation), RANK.indexOf(cap))];

// Fit score from the evidence map: must-haves weigh three times as much as nice-to-haves;
// strong evidence counts in full and partial evidence for half.
export const computeFit = (
    requirements: RequirementResult[],
    seniority: Seniority,
    sentences: {fitStrength?: string, fitConcern?: string} = {},
): FitReport => {
    const total = requirements.reduce((sum, item) => sum + PRIORITY_WEIGHT[item.priority], 0);
    const earned = requirements.reduce((sum, item) => sum + PRIORITY_WEIGHT[item.priority] * STRENGTH_CREDIT[item.strength], 0);
    const score = total === 0 ? 0 : Math.round((100 * earned) / total);

    let recommendation: FitRecommendation =
        score >= 75 ? "Strong fit" : score >= 55 ? "Worth applying" : score >= 35 ? "Stretch" : "Poor fit";

    const musts = requirements.filter((item) => item.priority === "must");
    const missingMusts = musts.filter((item) => item.strength === "none");
    // A senior or lead role without strong leadership evidence is a stretch, however good the technical match.
    const weakLeadership = (seniority === "senior" || seniority === "lead") &&
        musts.some((item) => item.category === "leadership" && item.strength !== "strong");
    if (weakLeadership) {
        recommendation = atMost(recommendation, "Stretch");
    }
    if (musts.length > 0 && missingMusts.length * 2 > musts.length) {
        recommendation = "Poor fit";
    }

    const positive = recommendation === "Strong fit" || recommendation === "Worth applying";
    const fallback = missingMusts.length > 0
        ? `Your CV doesn't show ${missingMusts.length} of the ${musts.length} must-haves: ${missingMusts.map((item) => item.text).join(", ")}.`
        : `Your CV shows evidence for every must-have.`;
    const reason = (positive ? sentences.fitStrength : sentences.fitConcern)?.trim() || fallback;

    return {score, recommendation, reason};
};

// Requirements the CV shows nothing for, split into questions for the candidate and gaps for a cover letter.
export const groupGaps = (requirements: JobRequirement[]): Gaps => {
    const missing = requirements.filter((requirement) => requirement.evidence.length === 0);
    return {
        ask: missing
            .filter((requirement) => requirement.ifMissing.kind === "ask")
            .map((requirement) => requirement.ifMissing.text.trim() || `Do you have experience with ${requirement.text}?`),
        real: missing
            .filter((requirement) => requirement.ifMissing.kind === "real")
            .map((requirement) => requirement.ifMissing.text.trim() || requirement.text),
    };
};
