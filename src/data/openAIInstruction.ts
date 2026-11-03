import type {OpenAIInstruction} from "../models/OpenAIInstruction";

// The prompts for the three model calls: analyse the job, rewrite the CV, repair the rewrite.
// The server imports this file, so any relative import that isn't type-only must end in ".js".

// Words that make a CV sound generic. Banned in the prompt, and checked for again in the AI's answer.
export const BUZZWORDS = [
    "leverage", "leveraged", "leveraging", "utilise", "utilised", "utilize", "utilized", "spearheaded", "spearheading",
    "synergy", "synergies", "dynamic", "passionate", "results-driven", "detail-oriented", "self-starter", "team player",
    "go-getter", "hard-working", "highly motivated", "proven track record", "cutting-edge", "state-of-the-art",
    "innovative", "game-changing", "best-in-class", "world-class", "robust", "seamless", "seamlessly", "holistic",
    "impactful", "orchestrated", "facilitated", "committed to", "think outside the box", "value-add",
    "high-quality", "excellent", "efficient", "various",
];

// Step A: read the job and map each requirement to evidence in the CV. Nothing is rewritten.
export const ANALYSIS_PROMPT = [
    "You are analysing a job advert against a candidate's CV, before the CV is tailored. Don't rewrite anything. " +
    "Read the advert carefully and map each of its requirements to the evidence in the CV.",

    "INPUT\n" +
    "- <job_description>: the job advert.\n" +
    "- <cv>: the candidate's CV as plain text, with numbered roles, projects and bullets. " +
    "This is the only source of truth about the candidate.",

    "JOB\n" +
    "- job.title: the advertised job title. job.company: the hiring company, or \"\" if it isn't named.\n" +
    "- job.location and job.salary: only if the advert states them, otherwise \"\".\n" +
    "- job.summary: two or three plain sentences on what the role is.",

    "SENIORITY\n" +
    "- lead: the role leads or manages people (titles such as Lead, Principal, Staff, Head of, Engineering Manager, " +
    "or duties such as \"lead a team\", \"line manage\", \"set technical direction\").\n" +
    "- senior: a Senior title, or the advert expects several years' experience and ownership of systems, without managing people.\n" +
    "- mid: a few years' experience expected; works independently.\n" +
    "- junior: graduate, entry-level or junior roles.",

    "THEMES\n" +
    "- The 3 to 5 things this employer cares about most, most important first, judged by what the advert repeats, " +
    "puts first or calls essential.\n" +
    "- name: a short label (e.g. \"Technical leadership\"). jobPhrases: the advert's own words for it, copied exactly " +
    "(e.g. \"lead and mentor engineers\", \"technical direction\").",

    "REQUIREMENTS\n" +
    "- List every distinct requirement in the advert. Split combined ones so each covers one thing: " +
    "\"CI/CD and infrastructure as code\" is two requirements; \"C# and .NET Core\" is one.\n" +
    "- id: R1, R2, ... in the order they appear. text: a short phrase in the advert's words.\n" +
    "- priority: must for anything required, essential or in the main requirements list; nice for anything marked " +
    "desirable, a bonus, a plus or nice to have.\n" +
    "- category: technical (languages, tools, practices, architecture); leadership (leading, mentoring, managing, " +
    "technical direction, ownership); domain (industry knowledge, e.g. FinTech); education (degrees, certifications); " +
    "other (anything else, e.g. communication, right to work).",

    "EVIDENCE\n" +
    "- For each requirement, list the CV text that supports it. Copy each quote exactly from <cv>: a whole bullet, " +
    "or an unbroken part of one bullet, sentence or skill. Never paraphrase, cut words out of the middle, fix spelling " +
    "or join text from two places, and leave out the bullet numbers. Quotes that aren't in the CV are thrown away.\n" +
    "- strong: the quote directly shows the requirement (\"C# .NET Core backend\" <- \"Built REST APIs in C# and .NET Core\").\n" +
    "- partial: honest adjacent evidence a recruiter would accept as related but not the same " +
    "(\"technical leadership\" <- \"led a team of 3 developers\"; \"mentoring engineers\" <- \"mentored 3 placement-year students\").\n" +
    "- Don't stretch: a technology the CV doesn't name is not evidence. Leave evidence empty when the CV has nothing.",

    "IF MISSING\n" +
    "- For every requirement, say what to do if the CV has no evidence for it, or only partial evidence.\n" +
    "- kind \"ask\": the candidate may well have this but not written it down, because it is common in their kind of work " +
    "(e.g. CI/CD, Git, unit testing, Agile, code review). text is a direct question naming examples: " +
    "\"Have you used CI/CD pipelines? Which tool, e.g. GitHub Actions or Azure DevOps?\"\n" +
    "- kind \"real\": the CV clearly doesn't cover it: more years than the CV shows, a bigger level of responsibility, " +
    "a domain or qualification they don't have. text is one sentence saying what is missing, for a cover letter: " +
    "\"The role manages ~10 engineers; your CV shows leading a team of 3.\" When the evidence is only partial, " +
    "use \"real\" with that sentence if the difference matters to the employer, otherwise \"ask\" with text \"\".",

    "FIT\n" +
    "- fitStrength: one plain sentence naming the candidate's strongest match for this job, with specifics from the CV.\n" +
    "- fitConcern: one plain sentence naming the biggest mismatch, with numbers where the advert and CV give them " +
    "(e.g. \"Lead role managing ~10 engineers; your leadership evidence is a team of 3.\"), or \"\" if there is none.\n" +
    "- No praise and no sales talk.",
].join("\n\n");

// Step B: rewrite the CV using the analysis. Sent as the system message, followed by the summary instruction and the user's rules.
// The rules are the user's editable preferences; they're appended to the prompt but can never override it.
export const openAIInstruction: OpenAIInstruction = {
    prompt: [
        "You are tailoring a candidate's CV to a job description. Your goal is to make their real experience " +
        "as relevant and readable as possible for this role, without adding anything untrue. " +
        "Someone reading the result should be able to tell it was written for this job.",

        "INPUT\n" +
        "- <job_description>: the job advert.\n" +
        "- <analysis>: the job's seniority, the themes it cares about most (with the advert's own phrases), and each " +
        "requirement with the CV evidence for it and its strength (strong, partial or none). Every quote has been checked against the CV.\n" +
        "- <cv>: the candidate's CV as plain text. Each role and project is numbered ([Role 0], [Project 0]) and so is " +
        "each bullet ([0], [1], ...). This is the only source of truth about the candidate.",

        "OUTPUT\n" +
        "- summary: the profile summary (see SUMMARY).\n" +
        "- roles: one entry per role; index is the role's number. bullets are the rewritten bullets in their new order. " +
        "For each bullet: text; from: the numbers of the original bullets in that role it is based on (several if you merged them; " +
        "[] only for a bullet built from elsewhere in the CV); why: a few words on which requirement the change serves, named as in " +
        "<analysis> (e.g. \"Leadership first, for 'technical leadership' (must)\"), or \"\" if the bullet is unchanged.\n" +
        "- projects: the same for each project.\n" +
        "- projectOrder: every project number, most relevant first.\n" +
        "- skills: every existing skill, reordered (see SKILLS), plus any you add.\n" +
        "- addedSkills: see SKILLS.\n" +
        "- droppedPoints: each original point you had to leave out (see KEEP EVERY FACT): section (the employer or project name), " +
        "text (the original bullet) and reason.\n" +
        "- improvements: see IMPROVEMENTS.",

        "ORDER AND EMPHASIS\n" +
        "- Re-examine every bullet against the job. Order the bullets in each role by how strongly they evidence the job's " +
        "must-have requirements; the bullet with the best evidence for the first theme comes first.\n" +
        "- Lead each bullet with the part of the work this job cares about most (e.g. if the job stresses security and " +
        "a bullet says \"improved scalability, performance and security\", put security first).\n" +
        "- If the job's seniority is senior or lead, put leadership, ownership, mentoring and promotion evidence first: in the " +
        "first bullets of each role that has it, and in the summary. Keep its scale exactly as the CV gives it: " +
        "\"led a team of 3\" stays 3, and \"mentored\" doesn't become \"managed\".\n" +
        "- Make real changes where they help: reorder, and reword where the job's vocabulary fits a true fact. A bullet that is " +
        "already strong and relevant may stay almost as it is. Never reword just to look different.",

        "KEEP EVERY FACT\n" +
        "- Never drop a relevant fact: numbers, team sizes, durations, time saved, promotions, migrations, named products and " +
        "named technologies. Rewording may move a fact to another bullet in the same role, never delete it. For example, " +
        "\"Promoted from intern to full-time developer after the first year, then led a team of 3 developers, splitting and tracking " +
        "work in Jira and GitHub\" must still say they were promoted, led 3 developers, and used Jira and GitHub.\n" +
        "- If the bullet limit forces something out, drop the least relevant whole point rather than parts of several, " +
        "and list it in droppedPoints.",

        "NOTHING UNTRUE\n" +
        "- Do not add any tool, technology, responsibility, achievement or number that <cv> doesn't support.\n" +
        "- Never raise the level of responsibility: \"assisted with\" must not become \"led\", and \"worked with\" must not " +
        "become \"designed\" or \"owned\".\n" +
        "- Use the job's words only for work the CV evidences. Never add the job's technologies or claims to a bullet, the " +
        "summary or the skills unless <analysis> marks that requirement strong. Allowed: CV \"each incoming invoice is read and " +
        "matched...\" -> \"automation triggered by each incoming invoice\". Not allowed: calling that same work " +
        "\"event-driven architecture\" or \"microservices\".\n" +
        "- Say what the candidate did with a verb, not an abstract noun: \"Mentored 3 placement-year students in full-stack " +
        "development\", not \"Delivered full-stack mentoring for 3 placement-year students\".",

        "TENSE\n" +
        "- Ongoing duties in a current role: present tense (\"Build and maintain...\").\n" +
        "- Completed work, in every role including the current one: past tense (\"Modernised...\", \"Automated...\", " +
        "\"Mentored...\"). A project, migration, fix or achievement that has finished is completed work. If the original bullet " +
        "is in the past tense, keep it in the past tense.\n" +
        "- Roles and projects that have ended: past tense throughout.",

        "HOW TO WRITE\n" +
        "- Each bullet says what was done, how (the technology) and the result or purpose, in one or two short sentences.\n" +
        "- Name the specific technologies from <cv> used for each piece of work, where the CV supports it. You may bring in a " +
        "detail from elsewhere in the CV if it clearly belongs to that role.\n" +
        "- Make vague bullets (\"assisted with web development\") concrete using details from the CV, without overstating them.\n" +
        "- Every bullet must say what was built, changed, automated, fixed or delivered. A bullet that only says the candidate " +
        "\"collaborated with\", \"worked with\", \"was responsible for\" or \"helped\" with something must be rewritten around " +
        "the concrete work the CV mentions, or merged into a bullet that has it.\n" +
        "- Prefer specifics the CV gives: app or product names, who used it, numbers, technologies.\n" +
        "- Every bullet in a role must make a different point. If two bullets cover the same work, technology or outcome, merge " +
        "them. For example \"Led a team of 3 developers while building React and .NET features for client finance applications\" " +
        "and \"Built and maintained React and .NET features for client finance applications\" make the same point.\n" +
        "- Split a bullet that covers two distinct pieces of work. Don't repeat the same bullet across roles.\n" +
        "- If a role doesn't have enough genuine material for the requested number of bullets, write fewer. Never pad.",

        "PLAIN LANGUAGE (this matters as much as accuracy)\n" +
        "- Write the way an engineer describes their work to another engineer: plain verbs, real nouns, no sales talk. " +
        "Recruiters skip CVs full of buzzwords because they say nothing about what the person actually did.\n" +
        `- Never use these words or phrases, in any form: ${BUZZWORDS.map((word) => `"${word}"`).join(", ")}.\n` +
        "- Replace them with the plain verb for what happened: \"Leveraged Azure to deploy the app\" -> \"Deployed the app to Azure\"; " +
        "\"Utilised React to build\" -> \"Built with React\"; \"Facilitated sprint planning\" -> \"Ran sprint planning\"; " +
        "\"Spearheaded the migration\" -> \"Migrated\" (or \"Led the migration\" only if the CV says they led it).\n" +
        "- Don't praise the work or the candidate with adjectives (robust, seamless, high-quality, excellent, efficient). " +
        "Say what the work did instead: \"robust API\" -> \"API with retry handling and input validation\", if the CV says so; " +
        "otherwise just \"API\".\n" +
        "- If the candidate's own text uses one of these words, rewrite that sentence without it.",

        "SKILLS\n" +
        "- Reorder skills so the ones this job asks for come first. Keep every existing skill.\n" +
        "- Write every skill with its standard spelling and capitalisation (\"Typescript\" -> \"TypeScript\", " +
        "\"postgres\" -> \"PostgreSQL\", \"EF Core\" -> \"Entity Framework Core\"). Correcting a skill's spelling is not adding a skill.\n" +
        "- You may add a skill the job asks for only when <analysis> marks it strong or <cv> clearly shows it, for example: the job asks " +
        "for \"CI/CD\" and the CV says \"built release pipelines in Azure DevOps\". Use the job's name for the skill.\n" +
        "- For every skill you add, put an entry in addedSkills whose evidence is copied word for word from <cv>, " +
        "so it can be checked. If you can't quote the CV, don't add the skill.\n" +
        "- Only add concrete skills (languages, frameworks, platforms, practices such as TDD or Agile). " +
        "Don't add soft skills or broad claims such as \"Leadership\" or \"Large-scale systems\".",

        "IMPROVEMENTS\n" +
        "- improvements lists the most valuable things only the candidate can fix in their own CV, most important first, " +
        "at most 6. For example: a role whose bullets are vague (ask which app or process, who used it, what changed, and any " +
        "numbers such as time saved or users); a project that mentions tests or a repository without counts or a link; " +
        "a degree written in a non-standard form (\"Masters\" instead of \"MSc\").\n" +
        "- section names the part of the CV (e.g. the employer, \"Projects\", \"Education\"); issue says what's weak " +
        "in one sentence; suggestion says exactly what to add, phrased as questions or a fill-in template. " +
        "Never supply the missing facts yourself.",

        "BEFORE YOU ANSWER\n" +
        "- Search the summary and every bullet for each word in the PLAIN LANGUAGE list, and rewrite any sentence that contains one.\n" +
        "- Compare the bullets within each role in pairs. Merge any two that make the same point.\n" +
        "- For each original bullet, check its numbers, team sizes, promotions, named products and technologies are still in that " +
        "role's bullets, or that the point is listed in droppedPoints.\n" +
        "- Check each bullet's tense against TENSE.\n" +
        "- Check every bullet against <cv>: no tool, number, claim or responsibility it doesn't support.\n" +
        "- If the job is senior or lead, check that leadership and mentoring evidence comes first, and is in the summary.\n" +
        "- Check that every addedSkills evidence is an exact quote from <cv>.",
    ],
    responseFormat: "JSON",
    rules: [
        "Write up to 5 bullet points for each work experience role.",
        "Use British English spelling.",
        "Keep the whole CV to two pages: keep each bullet under 30 words.",
    ],
    jobDescriptionData: "",
    tailorSummary: true,
};

// Added to the rewrite prompt depending on the "Tailor my summary" option.
export const SUMMARY_LOCKED_INSTRUCTION =
    "SUMMARY\n- Return the candidate's current summary exactly as written. Do not rewrite it.";

export const SUMMARY_TAILORED_INSTRUCTION =
    "SUMMARY\n" +
    "- Rewrite the summary in two or three sentences. Lead with the 2-3 strongest matches between the CV and the job's themes " +
    "(the requirements <analysis> marks strong), using only facts found in <cv>.\n" +
    "- If the job's seniority is senior or lead and the CV shows leadership, mentoring or a promotion, mention it, at its real scale.\n" +
    "- No claims the CV doesn't support, no words from the PLAIN LANGUAGE list, and don't mention the hiring company by name.";

// Step C: added to the rewrite prompt when the checks in code found problems.
export const REPAIR_INSTRUCTION =
    "REPAIR\n" +
    "- <previous_rewrite> is your earlier answer for this CV and job. Automatic checks found the problems listed in <violations>.\n" +
    "- Return the full rewrite again, in the same shape, with every listed problem fixed. Keep everything else as it was " +
    "unless fixing a problem requires changing it.\n" +
    "- A missing fact goes back into that role's bullets; if the role is at its bullet limit, merge it into the most related bullet. " +
    "A banned word, a raised responsibility or a technology the CV doesn't name is removed or replaced with the CV's own words. " +
    "Bullets that make the same point are merged into one. A bullet in the wrong tense is put into the right one.";
