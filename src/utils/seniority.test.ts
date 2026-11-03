import {describe, expect, it} from "vitest";
import {settleSeniority, worksUnderALead, yearsRequired} from "./seniority";
import {DOTNET_ANALYSIS, DOTNET_JOB, FULLSTACK_ANALYSIS, FULLSTACK_JOB, LEAD_ANALYSIS, LEAD_JOB} from "./__fixtures__/tailoringFixtures";

const job = (title: string) => ({job: {title, company: "", location: "", salary: "", summary: ""}});

describe("seniority", () => {
    it("reads the years an advert asks for", () => {
        expect(yearsRequired(FULLSTACK_JOB)).toBe(3);
        expect(yearsRequired("3+ years with React and 5+ years of C#")).toBe(5);
        expect(yearsRequired("Three to five years' experience")).toBe(3);
        expect(yearsRequired(LEAD_JOB)).toBeUndefined();
    });

    it("sees a role that works under a lead", () => {
        expect(worksUnderALead(FULLSTACK_JOB)).toBe(true);
        expect(worksUnderALead("Reporting to our Head of Engineering.")).toBe(true);
        expect(worksUnderALead(LEAD_JOB)).toBe(false);
    });

    it("brings the reported senior call down to mid: over three years, working with the Lead Developer", () => {
        expect(settleSeniority(FULLSTACK_JOB, FULLSTACK_ANALYSIS)).toBe("mid");
        expect(settleSeniority("Shape and lead the development of our apps. Over three years' experience.", {...job("Full Stack Developer"), seniority: "senior"})).toBe("mid");
    });

    it("keeps a senior or lead title, a call with no evidence against it, and never raises a call", () => {
        expect(settleSeniority(LEAD_JOB, LEAD_ANALYSIS)).toBe("lead");
        expect(settleSeniority("Work with the Lead Developer. 3+ years.", {...job("Senior Developer"), seniority: "senior"})).toBe("senior");
        expect(settleSeniority("Own our platform. 6+ years' experience.", {...job("Software Engineer"), seniority: "senior"})).toBe("senior");
        expect(settleSeniority(DOTNET_JOB, DOTNET_ANALYSIS)).toBe("mid");
        expect(settleSeniority("Graduate role. Work with the Lead Developer.", {...job("Developer"), seniority: "junior"})).toBe("junior");
    });
});
