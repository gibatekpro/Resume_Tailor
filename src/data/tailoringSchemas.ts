import {arrayOf, integer, object, oneOf, string} from "../utils/strictSchema.js";

// Output schemas for each model call. They mirror JobAnalysis and Rewrite in models/TailoringPipeline.ts.
// The server imports this file, so its relative imports end in ".js".

export const ANALYSIS_SCHEMA = object({
    job: object({title: string(), company: string(), location: string(), salary: string(), summary: string()}),
    seniority: oneOf("junior", "mid", "senior", "lead"),
    themes: arrayOf(object({name: string(), jobPhrases: arrayOf(string())})),
    requirements: arrayOf(object({
        id: string(),
        text: string(),
        priority: oneOf("must", "nice"),
        category: oneOf("technical", "leadership", "domain", "education", "other"),
        evidence: arrayOf(object({quote: string(), strength: oneOf("strong", "partial")})),
        ifMissing: object({kind: oneOf("ask", "real"), text: string()}),
    })),
    fitStrength: string(),
    fitConcern: string(),
});

const bullets = arrayOf(object({text: string(), from: arrayOf(integer()), why: string()}));

export const REWRITE_SCHEMA = object({
    summary: string(),
    roles: arrayOf(object({index: integer(), bullets})),
    projects: arrayOf(object({index: integer(), bullets})),
    projectOrder: arrayOf(integer()),
    skills: arrayOf(string()),
    addedSkills: arrayOf(object({skill: string(), evidence: string()})),
    droppedPoints: arrayOf(object({section: string(), text: string(), reason: string()})),
    improvements: arrayOf(object({section: string(), issue: string(), suggestion: string()})),
});
