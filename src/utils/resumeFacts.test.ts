import {describe, expect, it} from "vitest";
import type {ResumeInfo} from "../models/ResumeInfo";
import {lockResumeFacts, verifyAddedSkills} from "./resumeFacts";

const original: ResumeInfo = {
    resumeName: "Main CV",
    profile: {firstName: "Tony", lastName: "G", profession: "Software Developer", summary: "Original summary."},
    skills: ["C#", "Typescript", "React"],
    workExperience: [
        {companyName: "Cenitium", jobTitle: "Software Developer", duties: ["Built things."], startMonth: "Sep", startYear: "2021", endMonth: "", endYear: "", current: true},
        {companyName: "Ametek", jobTitle: "Intern", duties: ["Tested things."], startMonth: "Jun", startYear: "2020", endMonth: "Aug", endYear: "2020", current: false},
    ],
    projects: [
        {projectName: "Resume Tailor", role: "Author", projectDetails: ["Wrote it."], startMonth: "", startYear: "", endMonth: "", endYear: "", current: true},
        {projectName: "Game", role: "Author", projectDetails: ["Played it."], startMonth: "", startYear: "", endMonth: "", endYear: "", current: false},
    ],
    education: [{institutionName: "Uni", degree: "BSc", course: "CS", startMonth: "", startYear: "", endMonth: "", endYear: "", current: false}],
};

describe("lockResumeFacts", () => {
    it("takes only bullets, the summary and skill order from the AI, and restores every other fact", () => {
        const tailored: ResumeInfo = {
            profile: {firstName: "Anthony", profession: "Lead Engineer", summary: "Tailored summary."},
            skills: ["React", "TypeScript", "Kubernetes"],
            workExperience: [
                {...original.workExperience![1], jobTitle: "Senior Intern", startYear: "2019", duties: ["Tested the product."]},
                {...original.workExperience![0], companyName: "Cenitium", duties: ["Built the product."]},
            ],
            projects: [{...original.projects![1], projectDetails: ["Played it a lot."]}],
            education: [],
        };
        const locked = lockResumeFacts(original, tailored, {allowSummary: true});
        expect(locked.profile).toEqual({...original.profile, summary: "Tailored summary."});
        expect(locked.workExperience!.map((role) => [role.companyName, role.jobTitle, role.startYear, role.duties[0]])).toEqual([
            ["Cenitium", "Software Developer", "2021", "Built the product."],
            ["Ametek", "Intern", "2020", "Tested the product."],
        ]);
        expect(locked.projects!.map((project) => project.projectName)).toEqual(["Game", "Resume Tailor"]);
        expect(locked.education).toEqual(original.education);
        // Kubernetes isn't verified, so it's dropped; "TypeScript" adds capitals, so the AI's spelling is kept.
        expect(locked.skills).toEqual(["React", "TypeScript", "C#"]);
    });

    it("keeps the original summary when tailoring it is off", () => {
        const locked = lockResumeFacts(original, {profile: {summary: "Tailored."}}, {allowSummary: false});
        expect(locked.profile?.summary).toBe("Original summary.");
    });

    it("adds verified skills", () => {
        const locked = lockResumeFacts(original, {skills: ["CI/CD", "C#"]}, {addedSkills: [{skill: "CI/CD", evidence: "x"}]});
        expect(locked.skills).toEqual(["CI/CD", "C#", "Typescript", "React"]);
    });
});

describe("verifyAddedSkills", () => {
    const resume: ResumeInfo = {...original, workExperience: [{...original.workExperience![0], duties: ["Built release pipelines in Azure DevOps."]}]};

    it("accepts a skill backed by a real quote or named in the CV", () => {
        const {accepted, rejected} = verifyAddedSkills(resume, [
            {skill: "CI/CD", evidence: "Built release pipelines in Azure DevOps."},
            {skill: "Azure DevOps", evidence: ""},
        ]);
        expect(accepted.map((item) => item.skill)).toEqual(["CI/CD", "Azure DevOps"]);
        expect(rejected).toEqual([]);
    });

    it("rejects made-up evidence, skills already listed and malformed entries", () => {
        const {accepted, rejected} = verifyAddedSkills(resume, [
            {skill: "Kubernetes", evidence: "Deployed services to Kubernetes clusters"},
            {skill: "react", evidence: ""},
            {skill: 42},
            "nonsense",
        ]);
        expect(accepted).toEqual([]);
        expect(rejected).toEqual(["Kubernetes"]);
    });
});
