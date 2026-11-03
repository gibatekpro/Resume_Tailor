import {describe, expect, it} from "vitest";
import type {ResumeInfo} from "../models/ResumeInfo";
import type {Rewrite} from "../models/TailoringPipeline";
import {
    areNearDuplicates, extractFacts, findEscalations, findNearDuplicates, parseBulletRules, pastTenseOf, runChecks,
    startsWithPastTense, startsWithPresentTense,
} from "./tailoringChecks";
import {bannedWordsIn} from "./resumeFacts";

const role = (duties: string[], current = true, extra = {}) => ({
    companyName: "Cenitium", jobTitle: "Software Developer", duties,
    startMonth: "Sep", startYear: "2021", endMonth: "", endYear: "", current, ...extra,
});

const cv = (duties: string[], current = true, extra: Partial<ResumeInfo> = {}): ResumeInfo => ({
    profile: {firstName: "Tony", lastName: "G", summary: "Full-stack developer."},
    skills: ["C#", ".NET", "React", "Azure", "Jira", "GitHub"],
    workExperience: [role(duties, current)],
    ...extra,
});

const rewriteOf = (bullets: {text: string, from?: number[]}[], extra: Partial<Rewrite> = {}): Rewrite => ({
    summary: "Full-stack developer.",
    roles: [{index: 0, bullets: bullets.map((bullet) => ({text: bullet.text, from: bullet.from ?? [], why: ""}))}],
    projects: [],
    projectOrder: [],
    skills: [],
    addedSkills: [],
    droppedPoints: [],
    improvements: [],
    ...extra,
});

const checksOf = (result: ReturnType<typeof runChecks>) => result.violations.map((violation) => violation.check);

describe("banned words", () => {
    it("finds the original list and the new adjectives", () => {
        expect(bannedWordsIn("Leveraged Azure to deliver a robust API")).toEqual(expect.arrayContaining(["leveraged", "robust"]));
        expect(bannedWordsIn("Wrote high-quality, efficient code for various clients")).toEqual(["high-quality", "efficient", "various"]);
        expect(bannedWordsIn("Built an API that cut invoice checks from 2 days to 2 hours")).toEqual([]);
    });

    it("are flagged per bullet", () => {
        const original = cv(["Built the invoice API in C#"]);
        const result = runChecks(original, rewriteOf([{text: "Built an excellent invoice API in C#", from: [0]}]));
        expect(result.violations).toMatchObject([{check: "banned-word", where: "Software Developer · Cenitium", bullet: 0}]);
    });
});

describe("near-duplicate bullets", () => {
    it("catches the duplicate pair from the real run", () => {
        expect(areNearDuplicates(
            "Led a team of 3 developers while building full-stack React and .NET features, including finance applications for clients.",
            "Built and maintained React and .NET application features for client finance applications.",
        )).toBe(true);
    });

    it("catches bullets with the same verb and object", () => {
        expect(areNearDuplicates("Built React dashboards for the sales team", "Built React dashboards showing stock levels")).toBe(true);
    });

    it("leaves different points that share a tech stack alone", () => {
        expect(findNearDuplicates([
            "Modernised the price-list tool with React and .NET, cutting update time from 2 days to 2 hours.",
            "Built React and .NET features for client finance applications.",
            "Mentored 3 placement-year students in full-stack development.",
        ])).toEqual([]);
    });
});

describe("lost facts", () => {
    it("extracts numbers with what they count, technologies and responsibility words", () => {
        const labels = extractFacts(
            "Promoted from intern to full-time developer after the first year, then led a team of 3 developers, splitting and tracking work in Jira and GitHub.",
            ["Jira", "GitHub"],
        ).map((fact) => fact.label);
        expect(labels).toEqual(expect.arrayContaining(["3 developers", "Jira", "GitHub", "promoted", "led"]));
    });

    it("keeps a number that moved within the sentence, and loses one whose subject changed", () => {
        const [fact] = extractFacts("Led a team of three developers").filter((item) => item.kind === "number");
        expect(fact.present("Led a 3-developer team")).toBe(true);
        expect(fact.present("Mentored 3 students")).toBe(false);
    });

    it("flags the dropped promotion from the real run", () => {
        const original = cv([
            "Promoted from intern to full-time developer after the first year, then led a team of 3 developers, splitting and tracking work in Jira and GitHub.",
        ]);
        const result = runChecks(original, rewriteOf([
            {text: "Led a team of 3 developers while building full-stack React and .NET features, tracking work in Jira and GitHub.", from: [0]},
        ]));
        expect(result.violations).toHaveLength(1);
        expect(result.violations[0]).toMatchObject({check: "lost-fact"});
        expect(result.violations[0].message).toContain('"promoted"');
    });

    it("reports a fact the model said it had to drop instead of flagging it", () => {
        const original = cv(["Migrated 12 reports to Power BI.", "Built the invoice API in C#."]);
        const result = runChecks(original, rewriteOf([{text: "Built the invoice API in C#.", from: [1]}], {
            droppedPoints: [{section: "Cenitium", text: "Migrated 12 reports to Power BI.", reason: "Least relevant to the job"}],
        }));
        expect(result.violations).toEqual([]);
        expect(result.keptOut.map((item) => item.fact)).toEqual(expect.arrayContaining(["12 reports", "Power BI", "migrated"]));
    });
});

describe("raised responsibility", () => {
    it("flags led, owned, architected and managed when the original never says them", () => {
        expect(findEscalations("Worked on the billing service", "Led the billing service rewrite")).toEqual(["led"]);
        expect(findEscalations("Built the billing service", "Owned and architected the billing service")).toEqual(["owned", "architected"]);
        expect(findEscalations("Helped the team", "Managed the team")).toEqual(["managed"]);
    });

    it("allows them when the original says them", () => {
        expect(findEscalations("Led a team of 3 developers", "Led 3 developers")).toEqual([]);
        expect(findEscalations("Took ownership of the release process", "Owned the release process")).toEqual([]);
    });
});

describe("new technologies", () => {
    it("flags job technologies and architecture claims the CV never names", () => {
        const original = cv(["Each incoming invoice is read and matched against the order in C#."]);
        const result = runChecks(original, rewriteOf([
            {text: "Built event-driven microservices on Kubernetes, triggered by each incoming invoice, in C#.", from: [0]},
        ]));
        const terms = result.violations.filter((violation) => violation.check === "new-technology").map((violation) => violation.message);
        expect(terms.join(" ")).toMatch(/Kubernetes/);
        expect(terms.join(" ")).toMatch(/microservices/);
        expect(terms.join(" ")).toMatch(/event-driven/);
    });

    it("allows a verified added skill", () => {
        const original = cv(["Built release pipelines in Azure DevOps."]);
        const rewrite = rewriteOf([{text: "Built CI/CD release pipelines in Azure DevOps.", from: [0]}]);
        expect(checksOf(runChecks(original, rewrite))).toContain("new-technology");
        expect(checksOf(runChecks(original, rewrite, {addedSkills: ["CI/CD"]}))).not.toContain("new-technology");
    });
});

describe("tense", () => {
    it("recognises past and present starts", () => {
        expect(startsWithPastTense("Modernised the price-list tool")).toBe(true);
        expect(startsWithPastTense("Built the API")).toBe(true);
        expect(startsWithPresentTense("Modernise the price-list tool")).toBe(true);
        expect(startsWithPresentTense("Builds the API")).toBe(true);
        expect(startsWithPresentTense("Customer-facing API")).toBe(false);
        expect(pastTenseOf("Modernise")).toBe("Modernised");
        expect(pastTenseOf("build")).toBe("Built");
    });

    it("flags present tense for completed work in the current role, as in the real run", () => {
        const original = cv(["Modernised the price-list tool in React.", "Automated invoice checking in C#.", "Build and maintain client apps in React."]);
        const result = runChecks(original, rewriteOf([
            {text: "Modernise the price-list tool in React.", from: [0]},
            {text: "Automate invoice checking in C#.", from: [1]},
            {text: "Build and maintain client apps in React.", from: [2]},
        ]));
        expect(result.violations.filter((violation) => violation.check === "tense").map((violation) => violation.bullet)).toEqual([0, 1]);
    });

    it("allows present tense for a bullet that merges an ongoing duty with finished work", () => {
        const original = cv(["Build client apps in React.", "Deployed the apps to Azure App Service."]);
        const result = runChecks(original, rewriteOf([{text: "Build client apps in React, deployed to Azure App Service.", from: [0, 1]}]));
        expect(checksOf(result)).not.toContain("tense");
    });

    it("flags any present tense in a role that has ended", () => {
        const original = cv(["Build client apps in React."], false);
        expect(checksOf(runChecks(original, rewriteOf([{text: "Build client apps in React.", from: [0]}])))).toEqual(["tense"]);
    });
});

describe("leadership first", () => {
    const leadershipRole = role([
        "Built and maintain React and .NET features for client finance applications.",
        "Automated invoice checking in C#.",
        "Promoted from intern to full-time developer, then led a team of 3 developers.",
    ]);
    const thRole = {
        ...role([
            "Wrote automated tests in C# for metrology software.",
            "Fixed bugs in a WPF desktop application.",
            "Mentored a new intern on the test framework.",
        ], false),
        companyName: "Taylor Hobson", jobTitle: "Software Engineer",
    };
    const original: ResumeInfo = {...cv([]), workExperience: [leadershipRole, thRole]};
    const rewrite = (cenitium: string[], th: string[], summary = "Full-stack developer.") => ({
        ...rewriteOf([], {summary}),
        roles: [
            {index: 0, bullets: cenitium.map((text) => ({text, from: [leadershipRole.duties.indexOf(text)], why: ""}))},
            {index: 1, bullets: th.map((text) => ({text, from: [thRole.duties.indexOf(text)], why: ""}))},
        ],
    });
    const leadershipChecks = (result: ReturnType<typeof runChecks>) =>
        result.violations.filter((violation) => violation.check === "leadership-first").map((violation) => violation.where);

    it("flags a lead job when no role shows leadership in its first two bullets, and a summary without it", () => {
        const result = runChecks(original, rewrite(leadershipRole.duties, thRole.duties), {seniority: "lead"});
        expect(leadershipChecks(result)).toEqual(["Summary", "Software Developer · Cenitium"]);
    });

    it("accepts leadership as the second bullet of one role, while the TH role opens with its technical bullet", () => {
        const result = runChecks(original, rewrite(
            [leadershipRole.duties[0], leadershipRole.duties[2], leadershipRole.duties[1]],
            thRole.duties,
            "Full-stack developer who led a team of 3 developers.",
        ), {seniority: "lead"});
        expect(leadershipChecks(result)).toEqual([]);
    });

    it("accepts leadership early in any one role that has it", () => {
        const result = runChecks(original, rewrite(leadershipRole.duties, [thRole.duties[2], thRole.duties[0], thRole.duties[1]], "Mentored an intern."), {seniority: "senior"});
        expect(leadershipChecks(result)).toEqual([]);
    });

    it("doesn't apply to mid-level jobs", () => {
        expect(leadershipChecks(runChecks(original, rewrite(leadershipRole.duties, thRole.duties), {seniority: "mid"}))).toEqual([]);
    });
});

describe("bullet length and count", () => {
    it("reads the limits from the user's rules", () => {
        expect(parseBulletRules(["Write up to 5 bullet points for each work experience role.", "Keep each bullet under 30 words."]))
            .toEqual({maxBullets: 5, maxWords: 30});
        expect(parseBulletRules([])).toEqual({maxBullets: undefined, maxWords: 30});
    });

    it("flags long bullets and too many bullets", () => {
        const original = cv(["Built the API in C#."]);
        const long = `Built the API in C# ${"and more ".repeat(15)}`;
        const bullets = [{text: long, from: [0]}, ...["Fixed bugs in C#.", "Wrote tests in C#.", "Reviewed code in C#."].map((text) => ({text}))];
        const result = runChecks(original, rewriteOf(bullets), {rules: ["Write up to 3 bullet points for each role."]});
        expect(checksOf(result)).toEqual(expect.arrayContaining(["too-long", "too-many-bullets"]));
    });
});
