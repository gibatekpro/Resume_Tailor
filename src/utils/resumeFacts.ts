import type {ResumeInfo} from "../models/ResumeInfo";
import type {Project} from "../models/Project";
import type {AddedSkill, TailoringChanges} from "../models/TailoringChanges";

const normalise = (value?: string) => (value || "").trim().toLowerCase();

// Lowercase words only, keeping the characters that matter in tech names (C#, C++, .NET, Node.js).
const normaliseText = (value?: string) => ` ${(value || "").toLowerCase().replace(/[^a-z0-9#+.]+/g, " ").trim()} `;

const nonEmptyList = (items?: string[]) => {
    const filtered = (items || []).filter((item) => item && item.trim());
    return filtered.length > 0 ? filtered : undefined;
};

// Everything the candidate wrote about themselves, as one searchable block.
const cvText = (resume: ResumeInfo) => normaliseText([
    resume.profile?.summary,
    ...(resume.skills || []),
    ...(resume.workExperience || []).flatMap((role) => [role.jobTitle, role.description, ...(role.duties || [])]),
    ...(resume.projects || []).flatMap((project) => [project.role, project.description, ...(project.projectDetails || [])]),
    ...(resume.education || []).flatMap((education) => [education.degree, education.course]),
].filter(Boolean).join("\n"));

// A skill the AI added is kept only if the CV names it outright, or the AI's evidence is a real quote from the CV.
export const verifyAddedSkills = (original: ResumeInfo, suggested: unknown) => {
    const text = cvText(original);
    const existing = new Set((original.skills || []).map(normalise));
    const accepted: AddedSkill[] = [];
    const rejected: string[] = [];

    for (const item of Array.isArray(suggested) ? suggested : []) {
        const skill = typeof item?.skill === "string" ? item.skill.trim() : "";
        const evidence = typeof item?.evidence === "string" ? item.evidence.trim() : "";
        if (!skill || existing.has(normalise(skill)) || accepted.some((added) => normalise(added.skill) === normalise(skill))) {
            continue;
        }
        const quote = normaliseText(evidence);
        const namedInCv = text.includes(normaliseText(skill));
        const quotedFromCv = quote.trim().length >= 8 && text.includes(quote);
        if (namedInCv || quotedFromCv) {
            accepted.push({skill, evidence});
        } else {
            rejected.push(skill);
        }
    }
    return {accepted, rejected};
};

// The AI may only rewrite bullets (and the summary, if allowed), reorder skills and projects, and add verified skills.
// Everything else is copied back from the original CV, so a response that ignores the prompt can't change facts.
export const lockResumeFacts = <T extends ResumeInfo>(
    original: T,
    tailored: ResumeInfo,
    options: {addedSkills?: AddedSkill[], allowSummary?: boolean} = {},
): T => {
    // Match each original role by employer and title, falling back to employer alone in case the AI changed the title.
    // A role with no match keeps its original bullets rather than borrowing another role's.
    const unmatchedRoles = [...(tailored.workExperience || [])];
    const takeRole = (predicate: (item: typeof unmatchedRoles[number]) => boolean) => {
        const index = unmatchedRoles.findIndex(predicate);
        return index === -1 ? undefined : unmatchedRoles.splice(index, 1)[0];
    };
    const originalRoles = original.workExperience || [];
    const sameCompany = (a: {companyName: string}, b: {companyName: string}) => normalise(a.companyName) === normalise(b.companyName);
    const exactMatches = originalRoles.map((role) =>
        takeRole((item) => sameCompany(item, role) && normalise(item.jobTitle) === normalise(role.jobTitle))
    );
    const workExperience = originalRoles.map((role, index) => {
        const match = exactMatches[index] ?? takeRole((item) => sameCompany(item, role));
        return {...role, duties: nonEmptyList(match?.duties) ?? role.duties};
    });

    const originalProjects = original.projects || [];
    const orderedProjects = (tailored.projects || [])
        .map((item) => originalProjects.find((project) => normalise(project.projectName) === normalise(item.projectName)))
        .filter((project, index, list): project is Project => !!project && list.indexOf(project) === index);
    const projects = [
        ...orderedProjects,
        ...originalProjects.filter((project) => !orderedProjects.includes(project)),
    ].map((project) => {
        const match = tailored.projects?.find((item) => normalise(item.projectName) === normalise(project.projectName));
        return {
            ...project,
            description: match?.description || project.description,
            projectDetails: nonEmptyList(match?.projectDetails) ?? project.projectDetails,
        };
    });

    // Skills: the original list plus verified additions, in the AI's order; anything else is dropped.
    const allowedSkills = [...(nonEmptyList(original.skills) || []), ...(options.addedSkills || []).map((added) => added.skill)];
    let skills = original.skills;
    if (allowedSkills.length > 0) {
        const bySkill = new Map(allowedSkills.map((skill) => [normalise(skill), skill]));
        const ordered = (tailored.skills || [])
            .map((skill) => bySkill.get(normalise(skill)))
            .filter((skill): skill is string => !!skill);
        skills = [...new Set([...ordered, ...allowedSkills])];
    }

    const tailoredSummary = tailored.profile?.summary?.trim();
    const profile = options.allowSummary && tailoredSummary
        ? {...original.profile, summary: tailoredSummary}
        : original.profile;

    return {
        ...original,
        resumeName: tailored.resumeName || original.resumeName,
        profile,
        workExperience,
        projects,
        skills,
    };
};

// Side-by-side record of what the tailoring changed, for the "What changed" view.
export const describeChanges = (
    original: ResumeInfo,
    tailored: ResumeInfo,
    addedSkills: AddedSkill[],
    rejectedSkills: string[],
): TailoringChanges => {
    const before = original.profile?.summary?.trim() || "";
    const after = tailored.profile?.summary?.trim() || "";

    return {
        addedSkills,
        rejectedSkills,
        ...(before !== after ? {summary: {before, after}} : {}),
        roles: (tailored.workExperience || []).map((role, index) => ({
            title: [role.jobTitle, role.companyName].filter(Boolean).join(" · "),
            before: nonEmptyList(original.workExperience?.[index]?.duties) || [],
            after: nonEmptyList(role.duties) || [],
        })),
        projects: (tailored.projects || []).map((project) => ({
            title: project.projectName,
            before: nonEmptyList(original.projects?.find((item) => normalise(item.projectName) === normalise(project.projectName))?.projectDetails) || [],
            after: nonEmptyList(project.projectDetails) || [],
        })),
    };
};
