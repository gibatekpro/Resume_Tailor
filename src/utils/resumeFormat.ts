import type {ResumeInfo} from "../models/ResumeInfo";
import type {ContactInfo} from "../models/ContactInfo";

const hasText = (value?: string) => !!value && value.trim().length > 0;

const cleanList = (items?: string[]) => (items || []).map((item) => item.trim()).filter(Boolean);

// "September", "2017" -> "Sep 2017"
export const formatMonthYear = (month?: string, year?: string) => {
    const shortMonth = hasText(month) ? month!.trim().slice(0, 3) : "";
    return [shortMonth, (year || "").trim()].filter(Boolean).join(" ");
};

// A missing end date (or the current flag) means the role is ongoing.
export const formatPeriod = (item: {
    startMonth?: string; startYear?: string; endMonth?: string; endYear?: string; current?: boolean
}) => {
    const start = formatMonthYear(item.startMonth, item.startYear);
    const end = item.current || !hasText(item.endYear) ? "Present" : formatMonthYear(item.endMonth, item.endYear);
    return start ? `${start} – ${end}` : (end === "Present" ? "" : end);
};

// Shows "linkedin.com/in/name" instead of "https://www.linkedin.com/in/name/".
export const displayLink = (url?: string) =>
    (url || "").replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

export const contactText = (info: ContactInfo) =>
    hasText(info.infoDetails) ? info.infoDetails!.trim() : displayLink(info.infoLink);

export const initials = (resume: ResumeInfo) =>
    [resume.profile?.firstName, resume.profile?.lastName]
        .map((name) => (name || "").trim().charAt(0).toUpperCase())
        .join("");

// Drops the blank placeholder rows the forms start with, so they never print as empty bullets or headings.
export const cleanResume = (resume: ResumeInfo): ResumeInfo => ({
    ...resume,
    contactInfo: (resume.contactInfo || []).filter((info) => hasText(info.infoDetails) || hasText(info.infoLink)),
    skills: cleanList(resume.skills),
    workExperience: (resume.workExperience || [])
        .filter((role) => hasText(role.companyName) || hasText(role.jobTitle))
        .map((role) => ({...role, duties: cleanList(role.duties)})),
    projects: (resume.projects || [])
        .filter((project) => hasText(project.projectName))
        .map((project) => ({...project, projectDetails: cleanList(project.projectDetails)})),
    education: (resume.education || []).filter((education) => hasText(education.institutionName) || hasText(education.course)),
    languages: (resume.languages || []).filter((language) => hasText(language.name)),
});

// "MSc Software Engineering (Distinction)", the standard UK form. A grade already in brackets isn't wrapped twice.
export const educationTitle = (education: {degree?: string; course?: string; class?: string}) => {
    const title = [education.degree, education.course].filter(hasText).join(" ");
    const grade = (education.class || "").trim().replace(/^\((.*)\)$/, "$1");
    return grade ? `${title} (${grade})` : title;
};
