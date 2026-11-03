import type {ResumeInfo} from "../models/ResumeInfo";
import type {ReportSection, Rewrite, RewriteBullet} from "../models/TailoringPipeline";

const validIndexes = (indexes: number[], count: number) =>
    [...new Set(indexes)].filter((index) => Number.isInteger(index) && index >= 0 && index < count);

const cleanBullets = (bullets: RewriteBullet[], originalCount: number) => bullets
    .map((bullet) => ({text: bullet.text.trim(), from: validIndexes(bullet.from, originalCount), why: bullet.why.trim()}))
    .filter((bullet) => bullet.text);

// The original bullets, unchanged, for a section the model didn't return.
const unchanged = (bullets: string[]): RewriteBullet[] =>
    bullets.map((text, index) => ({text, from: [index], why: ""})).filter((bullet) => bullet.text.trim());

// Makes the model's rewrite safe to use: one entry per original role and project, in CV order, with valid indexes.
// A section the model left out (or emptied) keeps its original bullets.
export const sanitiseRewrite = (original: ResumeInfo, rewrite: Rewrite): Rewrite => {
    const sections = (entries: Rewrite["roles"], originals: string[][]) => originals.map((bullets, index) => {
        const match = cleanBullets(entries.find((entry) => entry.index === index)?.bullets || [], bullets.length);
        return {index, bullets: match.length > 0 ? match : unchanged(bullets)};
    });
    const projectCount = (original.projects || []).length;
    const projectOrder = validIndexes(rewrite.projectOrder, projectCount);
    return {
        ...rewrite,
        summary: rewrite.summary.trim(),
        roles: sections(rewrite.roles, (original.workExperience || []).map((role) => role.duties || [])),
        projects: sections(rewrite.projects, (original.projects || []).map((project) => project.projectDetails || [])),
        projectOrder: [...projectOrder, ...Array.from({length: projectCount}, (_, index) => index).filter((index) => !projectOrder.includes(index))],
    };
};

// The rewrite as a CV, ready for lockResumeFacts.
export const rewriteToResume = (original: ResumeInfo, rewrite: Rewrite): ResumeInfo => ({
    ...original,
    profile: {...original.profile, summary: rewrite.summary},
    workExperience: (original.workExperience || []).map((role, index) => ({
        ...role,
        duties: rewrite.roles[index]?.bullets.map((bullet) => bullet.text) ?? role.duties,
    })),
    projects: rewrite.projectOrder
        .map((index) => ({project: original.projects?.[index], index}))
        .filter((item) => !!item.project)
        .map(({project, index}) => ({
            ...project!,
            projectDetails: rewrite.projects[index]?.bullets.map((bullet) => bullet.text) ?? project!.projectDetails,
        })),
    skills: rewrite.skills,
});

// Each role and project with its original and rewritten bullets, for the checks and the "What changed" view.
// `original` keeps empty entries so each bullet's `from` indexes still point at the right original bullet.
export const buildSections = (original: ResumeInfo, rewrite: Rewrite): ReportSection[] => [
    ...(original.workExperience || []).map((role, index): ReportSection => ({
        kind: "role",
        index,
        title: [role.jobTitle, role.companyName].filter(Boolean).join(" · "),
        original: role.duties || [],
        bullets: rewrite.roles[index]?.bullets || [],
    })),
    ...(original.projects || []).map((project, index): ReportSection => ({
        kind: "project",
        index,
        title: project.projectName,
        original: project.projectDetails || [],
        bullets: rewrite.projects[index]?.bullets || [],
    })),
];
