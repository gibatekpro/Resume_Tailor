import type {ResumeInfo} from "../models/ResumeInfo";
import type {KeptOutFact, ReportSection, Rewrite, Seniority, Violation} from "../models/TailoringPipeline";
import {bannedWordsIn} from "./resumeFacts";
import {findTechTerms, mentionsTerm, TECH_TERMS} from "./techTerms";
import {containsPhrase, normaliseText, stem, tokens, wordCount} from "./text";
import {buildSections} from "./applyRewrite";

// Deterministic checks on a rewrite. Each returns plain data, so the same results drive the repair prompt and the UI.

// ---- Rules the user set ----

export const parseBulletRules = (rules: string[]) => {
    const text = rules.join("\n");
    const maxBullets = Number(text.match(/(\d+)\s+bullet/i)?.[1]) || undefined;
    const maxWords = Number(text.match(/(?:under|fewer than|less than|at most|no more than|up to|maximum of)\s+(\d+)\s+words/i)?.[1]) || 30;
    return {maxBullets, maxWords};
};

// ---- Near-duplicate bullets ----

const STOPWORDS = new Set((
    "a an and the of for to in on with by at from into as while including using via that which this these their " +
    "our its it was were is are be been my me i we who across over under within per each all both also so such"
).split(" "));

const contentWords = (text: string) => tokens(text).filter((word) => !STOPWORDS.has(word)).map(stem);

const overlap = (a: string, b: string) => {
    const setA = new Set(contentWords(a));
    const setB = new Set(contentWords(b));
    const shared = [...setA].filter((word) => setB.has(word)).length;
    const union = new Set([...setA, ...setB]).size;
    return {shared, jaccard: union > 0 ? shared / union : 0, smaller: Math.min(setA.size, setB.size)};
};

// Two bullets make the same point when most of their words are shared (Jaccard ≥ 0.5), when the shorter one is
// mostly contained in the longer (≥ 0.7), or when they start with the same verb and object.
export const areNearDuplicates = (a: string, b: string) => {
    const {shared, jaccard, smaller} = overlap(a, b);
    if (jaccard >= 0.5) return true;
    if (smaller >= 5 && shared / smaller >= 0.7) return true;
    const wordsA = contentWords(a);
    const wordsB = contentWords(b);
    return wordsA.length >= 3 && wordsB.length >= 3 && wordsA.slice(0, 3).join(" ") === wordsB.slice(0, 3).join(" ");
};

// A looser test, used when a point was dropped for the bullet limit: two bullets about the same work share about a third
// of their words (the two Power Automate bullets in the reported run), where bullets that only share a stack share far fewer.
export const coverSameWork = (a: string, b: string) => areNearDuplicates(a, b) || overlap(a, b).jaccard >= 0.3;

export const findNearDuplicates = (bullets: string[], same: (a: string, b: string) => boolean = areNearDuplicates) => {
    const pairs: [number, number][] = [];
    bullets.forEach((a, i) => bullets.slice(i + 1).forEach((b, offset) => {
        if (same(a, b)) pairs.push([i, i + 1 + offset]);
    }));
    return pairs;
};

// ---- Facts that must survive ----

export interface Fact {
    kind: "number" | "technology" | "responsibility";
    label: string;
    present: (text: string) => boolean;
}

// A base verb only counts when an object follows it ("design the API", "lead and mentor"), so a noun phrase such as
// "design patterns" or "lead developer" isn't read as something the candidate did.
const OBJECT = "(?:the|a|an|and|our|their|its|new|\\d+)";
const asVerb = (forms: string, base: string) => new RegExp(`\\b(?:${forms})\\b|\\b${base}s? ${OBJECT}\\b`);

// Each responsibility: the forms that show the candidate did it (to find it in the original), and any form at all
// (to find it in the rewrite).
const RESPONSIBILITIES: [string, RegExp, RegExp][] = [
    ["promoted", /\b(?:promoted|promotion)\b/, /\bpromot(?:ed|ion|ions|e|es|ing)\b/],
    ["led", asVerb("led|leading", "lead"), /\b(?:led|lead|leads|leading)\b/],
    ["mentored", asVerb("mentored|mentoring|mentorship", "mentor"), /\bmentor(?:ed|ing|s|ship)?\b/],
    ["migrated", asVerb("migrated|migrating", "migrate"), /\bmigrat(?:ed|e|es|ing|ion|ions)\b/],
    ["automated", asVerb("automated|automating", "automate"), /\bautomat(?:ed|e|es|ing|ion|ions)\b/],
    ["owned", asVerb("owned|owning|ownership", "own"), /\b(?:owned|owning|ownership)\b/],
    ["designed", asVerb("designed|designing", "design"), /\bdesign(?:ed|s|ing)?\b/],
];

const isNumber = (word: string) => /^\d+(?:\.\d+)?$/.test(word);

// A number counts as kept when it appears near the word it described ("3 developers" -> "a 3-developer team").
const numberFact = (words: string[], index: number): Fact => {
    const number = words[index];
    const context = words.slice(index + 1, index + 4).find((word) => !STOPWORDS.has(word) && !isNumber(word));
    return {
        kind: "number",
        label: context ? `${number} ${context}` : number,
        present: (text) => {
            const output = tokens(text);
            return output.some((word, i) => word === number &&
                (!context || output.slice(Math.max(0, i - 4), i + 5).some((near) => stem(near) === stem(context))));
        },
    };
};

// Numbers, named technologies (from the dictionary and the CV's own skills) and key responsibility words in a bullet.
export const extractFacts = (text: string, skills: string[] = []): Fact[] => {
    const words = tokens(text);
    const normalised = normaliseText(text);
    const facts: Fact[] = [
        ...words.flatMap((word, index) => isNumber(word) ? [numberFact(words, index)] : []),
        ...findTechTerms(text, skills).map((term): Fact => ({
            kind: "technology",
            label: term,
            present: (output) => mentionsTerm(output, term),
        })),
        ...RESPONSIBILITIES.filter(([, done]) => done.test(normalised)).map(([label, , anyForm]): Fact => ({
            kind: "responsibility",
            label,
            present: (output) => anyForm.test(normaliseText(output)),
        })),
    ];
    return facts.filter((fact, index) => facts.findIndex((other) => other.label === fact.label) === index);
};

// ---- Degrees in the summary ----

const DEGREE = /\b(BSc|BA|BEng|MEng|MSci|MSc|MA|MBA|MRes|MPhil|PhD|DPhil|LLB|LLM|HND|HNC)\b(?:[^.;]{0,60}?\b(Distinction|Merit|First[- ]Class(?: Honours)?|Upper Second(?:[- ]Class)?(?: Honours)?|2:1|2:2))?/g;

// Each degree a text names, with its grade when one follows it ("MSc Advanced Computer Science (Distinction)").
export const degreesIn = (text = ""): Fact[] => [...text.matchAll(DEGREE)].map(([, degree, grade]) => ({
    kind: "responsibility",
    label: grade ? `${degree} (${grade})` : degree,
    present: (output) => new RegExp(`\\b${degree}\\b`).test(output) && (!grade || new RegExp(grade, "i").test(output)),
}));

// ---- Plain writing ----

// "~", a slash between words ("emails/day") and abbreviations. Technology names keep their own slashes (CI/CD), and so do links.
const SLASHED_TERMS = TECH_TERMS.flat().filter((spelling) => spelling.includes("/"));
const ABBREVIATIONS = /(?<![\w.])(?:approx|hrs|mins|etc|e\.g|i\.e|vs)\b\.?/gi;
const LINK = /^(?:https?:\/\/|www\.|[\w-]+(?:\.[\w-]+)+\/)/i;

export const unplainMarks = (text: string) => {
    const rest = SLASHED_TERMS.reduce((value, term) => value.split(term).join(" "), text);
    return [
        ...(rest.includes("~") ? ["~"] : []),
        ...rest.split(/\s+/).filter((word) => word.includes("/") && !LINK.test(word)).map((word) => word.replace(/^\W+|[^\w/]+$/g, "")),
        ...(rest.match(ABBREVIATIONS) || []),
    ];
};

const PLAIN_WORDS = "Write it in plain words: \"about\" instead of \"~\", \"emails a day\" instead of \"emails/day\", " +
    "\"and\" or \"or\" instead of a slash, and no abbreviations.";

// ---- Raised responsibility ----

const ESCALATIONS: {word: string, output: RegExp, original: RegExp}[] = [
    {word: "led", output: /\b(?:led|leading)\b|^ lead\b/, original: /\b(?:led|lead|leads|leading|leader)\b/},
    {word: "owned", output: /\b(?:owned|owning|ownership)\b/, original: /\b(?:own|owned|owning|ownership|owner)\b/},
    {word: "architected", output: /\b(?:architected|architecting)\b/, original: /\barchitect(?:ed|ing|s)?\b/},
    {word: "managed", output: /\b(?:managed|managing)\b/, original: /\bmanag(?:e|ed|es|ing|er|ers|ement)\b/},
];

// Responsibility words in `output` that the original text never uses.
export const findEscalations = (originalText: string, output: string) => {
    const original = normaliseText(originalText);
    const rewritten = normaliseText(output);
    return ESCALATIONS.filter((item) => item.output.test(rewritten) && !item.original.test(original)).map((item) => item.word);
};

// ---- Leadership first, for senior and lead jobs ----

const LEADERSHIP = /\b(?:led|lead|leads|leading|mentor(?:ed|ing|s)?|promot(?:ed|ion)|managed|managing|owned|ownership|supervis(?:ed|ing)|coach(?:ed|ing))\b/;

export const showsLeadership = (text: string) => LEADERSHIP.test(normaliseText(text));

// ---- Tense ----

const IRREGULAR: Record<string, string> = {
    build: "built", rebuild: "rebuilt", lead: "led", write: "wrote", rewrite: "rewrote", run: "ran", make: "made",
    teach: "taught", drive: "drove", oversee: "oversaw", take: "took", undertake: "undertook", give: "gave",
    bring: "brought", begin: "began", grow: "grew", hold: "held", keep: "kept", send: "sent", spend: "spent",
    win: "won", choose: "chose", become: "became", find: "found", see: "saw", meet: "met", get: "got", sell: "sold",
    tell: "told", think: "thought", understand: "understood", plan: "planned", ship: "shipped", drop: "dropped",
    commit: "committed", scope: "scoped",
};
const PAST_IRREGULAR = new Set(Object.values(IRREGULAR));

const REGULAR_VERBS = (
    "design develop create implement maintain manage mentor automate modernise modernize migrate test deploy deliver " +
    "improve optimise optimize reduce increase integrate support own coordinate collaborate work analyse analyze " +
    "refactor fix debug document review train coach configure monitor launch produce provide introduce establish " +
    "streamline upgrade redesign replace convert extend add enable help assist contribute handle prepare present report " +
    "research prototype model define guide organise organize partner liaise communicate translate investigate resolve " +
    "troubleshoot secure scale host administer install track assign architect engineer code program serve use apply " +
    "standardise standardize simplify consolidate digitise digitize centralise centralize validate verify process match " +
    "check generate schedule identify evaluate assess recommend onboard recruit interview supervise direct oversee " +
    "deliver ensure respond operate perform publish release roll trial pilot speed cut save shorten raise lower"
).split(" ");
const BASE_VERBS = new Set([...REGULAR_VERBS, ...Object.keys(IRREGULAR)]);

const firstWord = (text: string) => tokens(text)[0] || "";

export const startsWithPastTense = (text: string) => {
    const word = firstWord(text);
    return PAST_IRREGULAR.has(word) || (word.length > 3 && word.endsWith("ed") && !BASE_VERBS.has(word));
};

// "Build", "Builds", "Modernise": a verb in the present tense. Unknown words are not flagged.
export const startsWithPresentTense = (text: string) => {
    const word = firstWord(text);
    return BASE_VERBS.has(word) || (word.endsWith("s") && BASE_VERBS.has(word.slice(0, -1))) ||
        (word.endsWith("es") && BASE_VERBS.has(word.slice(0, -2)));
};

export const pastTenseOf = (verb: string) => {
    const word = verb.toLowerCase();
    const past = IRREGULAR[word] ?? (word.endsWith("e") ? `${word}d` : /[^aeiou]y$/.test(word) ? `${word.slice(0, -1)}ied` : `${word}ed`);
    return past.charAt(0).toUpperCase() + past.slice(1);
};

// ---- All checks ----

const quote = (text: string) => `"${text.length > 90 ? `${text.slice(0, 87)}...` : text}"`;

const sectionIsCurrent = (original: ResumeInfo, section: ReportSection) =>
    !!(section.kind === "role" ? original.workExperience?.[section.index]?.current : original.projects?.[section.index]?.current);

// Text kept from the original that the rewrite doesn't replace: the job title or project role, and the description.
const sectionContext = (original: ResumeInfo, section: ReportSection) => {
    const role = section.kind === "role" ? original.workExperience?.[section.index] : undefined;
    const project = section.kind === "project" ? original.projects?.[section.index] : undefined;
    return {title: role?.jobTitle || project?.role || "", description: role?.description || project?.description || ""};
};

export const runChecks = (
    original: ResumeInfo,
    rewrite: Rewrite,
    options: {rules?: string[], addedSkills?: string[], tailorSummary?: boolean, seniority?: Seniority, jobTerms?: string[]} = {},
) => {
    const {maxBullets, maxWords} = parseBulletRules(options.rules || []);
    const skills = (original.skills || []).filter((skill) => skill.trim());
    const allCvText = [
        original.profile?.summary, original.profile?.profession, ...skills,
        ...(original.workExperience || []).flatMap((role) => [role.jobTitle, role.description, ...(role.duties || [])]),
        ...(original.projects || []).flatMap((project) => [project.projectName, project.role, project.description, ...(project.projectDetails || [])]),
        ...(original.education || []).flatMap((education) => [education.degree, education.course]),
    ].filter(Boolean).join("\n");
    const allowedText = [allCvText, ...(options.addedSkills || [])].join("\n");
    const newTechnologies = (text: string) => findTechTerms(text).filter((term) => !mentionsTerm(allowedText, term));

    const violations: Violation[] = [];
    const keptOut: KeptOutFact[] = [];
    const add = (check: Violation["check"], where: string, message: string, bullet?: number) =>
        violations.push({check, where, message, ...(bullet !== undefined ? {bullet} : {})});

    const leadershipFirst = options.seniority === "senior" || options.seniority === "lead";
    const cvShowsLeadership = [...(original.workExperience || []), ...(original.projects || [])]
        .some((item) => ("duties" in item ? item.duties : item.projectDetails)?.some(showsLeadership));

    if (options.tailorSummary !== false && rewrite.summary) {
        if (leadershipFirst && cvShowsLeadership && !showsLeadership(rewrite.summary)) {
            add("leadership-first", "Summary", "This is a senior or lead job and the CV shows leadership, mentoring or a promotion, but the summary doesn't mention it. Add it, at its real scale.");
        }
        for (const word of bannedWordsIn(rewrite.summary)) add("banned-word", "Summary", `The summary uses the banned word "${word}".`);
        for (const word of findEscalations(allCvText, rewrite.summary)) {
            add("escalation", "Summary", `The summary says the candidate ${word}, which the CV never says. Use the CV's own level of responsibility.`);
        }
        for (const term of newTechnologies(rewrite.summary)) add("new-technology", "Summary", `The summary mentions "${term}", which isn't anywhere in the CV. Remove it.`);
        for (const degree of degreesIn(original.profile?.summary)) {
            if (!degree.present(rewrite.summary)) add("lost-fact", "Summary", `The original summary mentions "${degree.label}". Keep it in the summary.`);
        }
        const marks = unplainMarks(rewrite.summary);
        if (marks.length > 0) add("plain-writing", "Summary", `The summary uses ${marks.map((mark) => `"${mark}"`).join(", ")}. ${PLAIN_WORDS}`);
    }

    const sections = buildSections(original, rewrite);
    for (const section of sections) {
        const where = section.title;
        const texts = section.bullets.map((bullet) => bullet.text);
        const current = sectionIsCurrent(original, section);
        const {title, description} = sectionContext(original, section);
        const originalText = [...section.original, title, description].join("\n");
        // The description is kept as written, so a fact that is still there counts as kept.
        const output = [...texts, description].join("\n");

        section.bullets.forEach((bullet, index) => {
            const n = index + 1;
            for (const word of bannedWordsIn(bullet.text)) add("banned-word", where, `Bullet ${n} uses the banned word "${word}".`, index);
            for (const word of findEscalations(originalText, bullet.text)) {
                add("escalation", where, `Bullet ${n} says the candidate ${word} something, but the original never says so. Keep the original level of responsibility.`, index);
            }
            for (const term of newTechnologies(bullet.text)) add("new-technology", where, `Bullet ${n} mentions "${term}", which isn't anywhere in the CV. Remove it.`, index);
            const marks = unplainMarks(bullet.text);
            if (marks.length > 0) add("plain-writing", where, `Bullet ${n} uses ${marks.map((mark) => `"${mark}"`).join(", ")}. ${PLAIN_WORDS}`, index);

            // Completed work: a role that has ended, or a bullet whose every source was written in the past tense.
            const completed = !current || (bullet.from.length > 0 && bullet.from.every((from) => startsWithPastTense(section.original[from] || "")));
            if (completed && startsWithPresentTense(bullet.text)) {
                const verb = tokens(bullet.text)[0];
                add("tense", where, `Bullet ${n} starts with the present tense "${verb}" for completed work. Use the past tense ("${pastTenseOf(verb)}").`, index);
            }
            const words = wordCount(bullet.text);
            if (words > maxWords) add("too-long", where, `Bullet ${n} is ${words} words long. Keep it to ${maxWords} words or fewer.`, index);
        });

        // Dropping a distinct point while two bullets still make the same point wastes a place: merge them and keep the point.
        const droppedHere = rewrite.droppedPoints.find((point) => point.section.trim() && containsPhrase(where, point.section));
        for (const [a, b] of findNearDuplicates(texts, droppedHere ? coverSameWork : areNearDuplicates)) {
            add("near-duplicate", where, droppedHere
                ? `Bullets ${a + 1} and ${b + 1} make the same point, while ${quote(droppedHere.text)} was dropped. Merge bullets ${a + 1} and ${b + 1} into one bullet and put the dropped point back.`
                : `Bullets ${a + 1} and ${b + 1} make the same point. Merge them into one bullet.`, b);
        }

        // Project bullets are ordered for the job like role bullets: the one naming most of the job's technologies first.
        const relevance = texts.map((text) => (options.jobTerms || []).filter((term) => mentionsTerm(text, term)));
        const best = relevance.reduce((top, terms, index) => terms.length > relevance[top].length ? index : top, 0);
        if (section.kind === "project" && best > 0) {
            add("order", where, `Bullet ${best + 1} names more of the job's technologies (${relevance[best].join(", ")}) than bullet 1. ` +
                "Rewrite and order this project's bullets for the job, as for roles: most relevant first.", 0);
        }

        if (section.kind === "role" && maxBullets && texts.length > maxBullets) {
            add("too-many-bullets", where, `This role has ${texts.length} bullets; the limit is ${maxBullets}. Merge bullets or drop the least relevant point and report it in droppedPoints.`);
        }

        const facts = section.original.flatMap((source) => extractFacts(source, skills).map((fact) => ({fact, source})))
            .filter((item, index, all) => all.findIndex((other) => other.fact.label === item.fact.label) === index);
        for (const {fact, source} of facts) {
            if (fact.present(output)) continue;
            const dropped = rewrite.droppedPoints.find((point) => fact.present(point.text));
            if (dropped) {
                keptOut.push({where, fact: fact.label, text: dropped.text, reason: dropped.reason});
            } else {
                add("lost-fact", where, `The fact "${fact.label}" from the original bullet ${quote(source)} is missing. Put it back in one of this section's bullets.`);
            }
        }
    }

    // For a senior or lead job, at least one role with leadership evidence must show it within its first two bullets.
    // Other roles may lead with their strongest technical work.
    const leadershipRoles = sections.filter((section) => section.kind === "role" && section.original.some(showsLeadership));
    if (leadershipFirst && leadershipRoles.length > 0 &&
        !leadershipRoles.some((section) => section.bullets.slice(0, 2).some((bullet) => showsLeadership(bullet.text)))) {
        add("leadership-first", leadershipRoles[0].title,
            "This is a senior or lead job: put a leadership, mentoring or promotion bullet within the first two bullets of this role.");
    }

    return {violations, keptOut};
};
