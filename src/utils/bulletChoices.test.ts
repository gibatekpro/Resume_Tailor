import {describe, expect, it} from "vitest";
import type {ResumeInfo} from "../models/ResumeInfo";
import type {ReportSection} from "../models/TailoringPipeline";
import {
    applySectionChoices, applySummaryChoice, bulletKey, changedSections, chosenBullets, isChanged, movedFrom, NO_CHOICES, sectionKey, toggle,
    unusedOriginals,
} from "./bulletChoices";

const section: ReportSection = {
    kind: "role",
    index: 0,
    title: "Software Developer · Cenitium",
    original: ["Built features.", "Promoted, then led a team of 3.", "Deployed to Azure.", "Mentored 3 students."],
    bullets: [
        {text: "Promoted, then led a team of 3.", from: [1], why: ""},
        {text: "Built features, deployed to Azure.", from: [0, 2], why: "Azure (must)"},
        {text: "Used React for the sales tool.", from: [], why: "React (must)"},
    ],
};

describe("change detection", () => {
    it("tells reworded, merged and new bullets from moved ones", () => {
        expect(section.bullets.map((bullet) => isChanged(section, bullet))).toEqual([false, true, true]);
        expect(movedFrom(section, section.bullets[0], 0)).toBe(1);
        expect(movedFrom(section, section.bullets[1], 1)).toBeUndefined();
    });

    it("lists original bullets the rewrite doesn't use", () => {
        expect(unusedOriginals(section)).toEqual([{text: "Mentored 3 students.", index: 3}]);
    });
});

describe("chosenBullets", () => {
    it("is the AI's proposal when nothing is reverted", () => {
        expect(chosenBullets(section, NO_CHOICES)).toEqual(section.bullets.map((bullet) => bullet.text));
    });

    it("puts a merged bullet back as its original bullets, and removes a reverted new bullet", () => {
        const choices = {reverted: [bulletKey(section, 1), bulletKey(section, 2)], originalOrder: []};
        expect(chosenBullets(section, choices)).toEqual(["Promoted, then led a team of 3.", "Built features.", "Deployed to Azure."]);
    });

    it("doesn't repeat an original bullet another accepted bullet already shows", () => {
        const overlapping: ReportSection = {...section, bullets: [
            {text: "Built features.", from: [0], why: ""},
            {text: "Built features, deployed to Azure.", from: [0, 2], why: ""},
        ]};
        expect(chosenBullets(overlapping, {reverted: [bulletKey(overlapping, 1)], originalOrder: []}))
            .toEqual(["Built features.", "Deployed to Azure."]);
    });

    it("can show the bullets in the original order", () => {
        expect(chosenBullets(section, {reverted: [], originalOrder: [sectionKey(section)]})).toEqual([
            "Built features, deployed to Azure.", "Promoted, then led a team of 3.", "Used React for the sales tool.",
        ]);
    });
});

describe("applying choices to the CV", () => {
    const resume: ResumeInfo = {
        profile: {summary: "Tailored."},
        workExperience: [
            {companyName: "Cenitium", jobTitle: "Software Developer", duties: ["edited by hand"], startMonth: "", startYear: "", endMonth: "", endYear: ""},
            {companyName: "Ametek", jobTitle: "Intern", duties: ["also edited"], startMonth: "", startYear: "", endMonth: "", endYear: ""},
        ],
        projects: [{projectName: "Game", role: "", projectDetails: ["a"], startMonth: "", startYear: "", endMonth: "", endYear: "", current: false}],
    };

    it("changes only the chosen section", () => {
        const updated = applySectionChoices(resume, section, {reverted: [bulletKey(section, 2)], originalOrder: []});
        expect(updated.workExperience![0].duties).toEqual(["Promoted, then led a team of 3.", "Built features, deployed to Azure."]);
        expect(updated.workExperience![1].duties).toEqual(["also edited"]);
    });

    it("matches projects by name", () => {
        const project: ReportSection = {kind: "project", index: 3, title: "Game", original: ["a"], bullets: [{text: "b", from: [0], why: ""}]};
        expect(applySectionChoices(resume, project, NO_CHOICES).projects![0].projectDetails).toEqual(["b"]);
    });

    it("reverts and restores the summary", () => {
        const summary = {before: "Original.", after: "Tailored."};
        const reverted = {reverted: toggle([], "summary"), originalOrder: []};
        expect(applySummaryChoice(resume, reverted, summary).profile!.summary).toBe("Original.");
        expect(applySummaryChoice(resume, {...reverted, reverted: toggle(reverted.reverted, "summary")}, summary).profile!.summary).toBe("Tailored.");
    });
});

describe("changedSections", () => {
    it("finds only the sections whose choices changed", () => {
        const other: ReportSection = {...section, index: 10};
        const next = {reverted: [bulletKey(section, 1), "summary"], originalOrder: [sectionKey(other)]};
        expect(changedSections([section, other], NO_CHOICES, next)).toEqual([section, other]);
        expect(changedSections([section, other], next, {...next, originalOrder: []})).toEqual([other]);
        expect(changedSections([section, other], next, next)).toEqual([]);
    });
});
