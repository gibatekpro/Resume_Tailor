
export interface AddedSkill {
    skill: string;
    evidence: string;   // the line from the CV that backs the skill up
}

// Before/after record of one generation, so the user can see exactly what the AI changed.
export interface TailoringChanges {
    addedSkills: AddedSkill[];
    rejectedSkills: string[];   // skills the AI suggested but couldn't back up from the CV; not added
    summary?: { before: string; after: string };
    roles: { title: string; before: string[]; after: string[] }[];
    projects: { title: string; before: string[]; after: string[] }[];
}
