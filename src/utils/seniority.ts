import type {JobAnalysis, Seniority} from "../models/TailoringPipeline";
import {normaliseText} from "./text";

// The model can call a job senior from one phrase ("shape and lead the development"). The years an advert asks for and
// who the role works under are better evidence, so they can bring a senior or lead call down to mid. Never up.

const SENIOR_TITLE = /\b(?:senior|sr|lead|principal|staff|head|manager|director|architect|chief|vp)\b/;

// "work with the Lead Developer", "reporting to our Head of Engineering": the role sits under a lead.
const UNDER_A_LEAD = new RegExp(
    "\\b(?:report(?:s|ing)? (?:in)?to|work(?:s|ing)? (?:closely )?(?:with|alongside|under)|supported by|mentored by) " +
    "(?:the|our|a|your) (?:lead|senior|principal|head|tech lead|engineering manager|cto)\\b",
);

// The most years of experience the advert asks for ("over three years", "3+ years", "3 to 5 years"), or undefined.
export const yearsRequired = (jobDescription: string) => {
    const matches = [...normaliseText(jobDescription).matchAll(/ (?:over |at least |minimum of |more than )?(\d+)\+?(?: (?:to |or )?\d+\+?)?(?: or more| plus)? years? /g)];
    const years = matches.map((match) => Number(match[1])).filter((value) => value > 0 && value <= 20);
    return years.length > 0 ? Math.max(...years) : undefined;
};

export const worksUnderALead = (jobDescription: string) => UNDER_A_LEAD.test(normaliseText(jobDescription));

export const settleSeniority = (jobDescription: string, analysis: Pick<JobAnalysis, "job" | "seniority">): Seniority => {
    const {seniority} = analysis;
    if ((seniority !== "senior" && seniority !== "lead") || SENIOR_TITLE.test(normaliseText(analysis.job.title))) {
        return seniority;
    }
    const years = yearsRequired(jobDescription);
    return worksUnderALead(jobDescription) || (years !== undefined && years < 5) ? "mid" : seniority;
};
