import type {ResumeInfo} from "../models/ResumeInfo";
import type {ReportSection, RewriteBullet, TailoringChoices} from "../models/TailoringPipeline";

// The user's accept/revert choices are kept apart from the AI's proposal, and each section's bullets are
// recomputed from the two. So reverting and then accepting again always gives back the AI's exact text.

export const NO_CHOICES: TailoringChoices = {reverted: [], originalOrder: []};
export const SUMMARY_KEY = "summary";

export const sectionKey = (section: Pick<ReportSection, "kind" | "index">) => `${section.kind}:${section.index}`;
export const bulletKey = (section: Pick<ReportSection, "kind" | "index">, bullet: number) => `${sectionKey(section)}:${bullet}`;

// A bullet the AI reworded, merged or wrote from elsewhere in the CV. Bullets it only moved don't count.
export const isChanged = (section: ReportSection, bullet: RewriteBullet) =>
    bullet.from.length !== 1 || (section.original[bullet.from[0]] || "").trim() !== bullet.text.trim();

// Where an unchanged bullet was in the original, when the AI moved it.
export const movedFrom = (section: ReportSection, bullet: RewriteBullet, position: number) =>
    bullet.from.length === 1 && !isChanged(section, bullet) && bullet.from[0] !== position ? bullet.from[0] : undefined;

// Original bullets the rewrite doesn't build on at all.
export const unusedOriginals = (section: ReportSection) => {
    const used = new Set(section.bullets.flatMap((bullet) => bullet.from));
    return section.original.map((text, index) => ({text, index})).filter((item) => item.text.trim() && !used.has(item.index));
};

// The section's bullets after the user's choices. A reverted bullet becomes the original bullet(s) it came from,
// skipping any already shown by another bullet; a reverted bullet written from elsewhere in the CV is removed.
// "Original order" sorts bullets by the earliest original bullet they came from.
export const chosenBullets = (section: ReportSection, choices: TailoringChoices) => {
    const items = section.bullets.map((bullet, index) => ({bullet, index}));
    if (choices.originalOrder.includes(sectionKey(section))) {
        const firstSource = (bullet: RewriteBullet) => bullet.from.length > 0 ? Math.min(...bullet.from) : Infinity;
        items.sort((a, b) => firstSource(a.bullet) - firstSource(b.bullet) || a.index - b.index);
    }
    const shown = new Set(items
        .filter(({index}) => !choices.reverted.includes(bulletKey(section, index)))
        .flatMap(({bullet}) => bullet.from));
    const result: string[] = [];
    for (const {bullet, index} of items) {
        if (!choices.reverted.includes(bulletKey(section, index))) {
            result.push(bullet.text);
            continue;
        }
        for (const from of [...bullet.from].sort((a, b) => a - b)) {
            const original = section.original[from];
            if (original?.trim() && !shown.has(from)) {
                result.push(original);
                shown.add(from);
            }
        }
    }
    return result;
};

// The CV with one section's bullets set from the choices. Roles match by position, projects by name
// (the tailored CV may have reordered projects). Other sections, including the user's manual edits, are left alone.
export const applySectionChoices = <T extends ResumeInfo>(resume: T, section: ReportSection, choices: TailoringChoices): T => {
    const bullets = chosenBullets(section, choices);
    if (section.kind === "role") {
        return {
            ...resume,
            workExperience: (resume.workExperience || []).map((role, index) => index === section.index ? {...role, duties: bullets} : role),
        };
    }
    return {
        ...resume,
        projects: (resume.projects || []).map((project) => project.projectName === section.title ? {...project, projectDetails: bullets} : project),
    };
};

export const applySummaryChoice = <T extends ResumeInfo>(resume: T, choices: TailoringChoices, summary: {before: string, after: string}): T => ({
    ...resume,
    profile: {...resume.profile, summary: choices.reverted.includes(SUMMARY_KEY) ? summary.before : summary.after},
});

export const toggle = (list: string[], key: string) => list.includes(key) ? list.filter((item) => item !== key) : [...list, key];

// The sections whose choices differ between two sets of choices, so only those are rewritten in the form.
export const changedSections = (sections: ReportSection[], previous: TailoringChoices, next: TailoringChoices) => {
    const keysFor = (section: ReportSection, choices: TailoringChoices) => {
        const key = sectionKey(section);
        return [...choices.reverted, ...choices.originalOrder.map((item) => `order:${item}`)]
            .filter((item) => item === `order:${key}` || item.startsWith(`${key}:`))
            .sort().join(",");
    };
    return sections.filter((section) => keysFor(section, previous) !== keysFor(section, next));
};
