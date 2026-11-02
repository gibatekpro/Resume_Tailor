import type {ResumeInfo} from "../models/ResumeInfo";
import type {Project} from "../models/Project";

const normalise = (value?: string) => (value || "").trim().toLowerCase();

const nonEmptyList = (items?: string[]) => {
    const filtered = (items || []).filter((item) => item && item.trim());
    return filtered.length > 0 ? filtered : undefined;
};

// The AI may only rewrite bullets and reorder skills and projects. Everything else is copied back from the
// original CV, so a response that ignores the prompt can't change facts or add skills the user doesn't have.
export const lockResumeFacts = <T extends ResumeInfo>(original: T, tailored: ResumeInfo): T => {
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

    const originalSkills = nonEmptyList(original.skills);
    let skills = original.skills;
    if (originalSkills) {
        const bySkill = new Map(originalSkills.map((skill) => [normalise(skill), skill]));
        const ordered = (tailored.skills || [])
            .map((skill) => bySkill.get(normalise(skill)))
            .filter((skill): skill is string => !!skill);
        skills = [...new Set([...ordered, ...originalSkills])];
    }

    return {
        ...original,
        resumeName: tailored.resumeName || original.resumeName,
        workExperience,
        projects,
        skills,
    };
};
