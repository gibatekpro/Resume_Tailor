import type {OpenAIInstruction} from "../models/OpenAIInstruction";

// Words that make a CV sound generic. Banned in the prompt, and checked for again in the AI's answer.
export const BUZZWORDS = [
    "leverage", "leveraged", "leveraging", "utilise", "utilised", "utilize", "utilized", "spearheaded", "spearheading",
    "synergy", "synergies", "dynamic", "passionate", "results-driven", "detail-oriented", "self-starter", "team player",
    "go-getter", "hard-working", "highly motivated", "proven track record", "cutting-edge", "state-of-the-art",
    "innovative", "game-changing", "best-in-class", "world-class", "robust", "seamless", "seamlessly", "holistic",
    "impactful", "orchestrated", "facilitated", "committed to", "think outside the box", "value-add",
];

// The prompt is fixed: it holds the truthfulness rules and the output contract, and is sent as the system message.
// The rules are the user's editable preferences; they're appended to the prompt but can never override it.
export const openAIInstruction: OpenAIInstruction = {
    prompt: [
        "You are tailoring a candidate's CV to a job description. Your goal is to make their real experience " +
        "as relevant and readable as possible for this role, without adding anything untrue.",

        "INPUT\n" +
        "- <job_description>: the job advert.\n" +
        "- <cv>: the candidate's CV as JSON (a ResumeInfo object). This is the only source of truth about the candidate.",

        "OUTPUT\n" +
        "Return a single JSON object, with no backticks or ```json fence, of this shape:\n" +
        `{
    "openAIDocumentTitle": string,        // "firstname-lastname-company", lowercase and hyphenated, company name only, e.g. "john-doe-google"
    "openAIJobTitle": string,             // the advertised job title
    "openAIJobCompanyName": string,       // the hiring company
    "openAIExpectedSalary": string,       // only if stated in the advert, otherwise ""
    "openAIJobLocation": string,          // only if stated in the advert, otherwise ""
    "openAISimpleJobDescription": string, // two or three plain sentences summarising the role
    "openAIAddedSkills": { "skill": string, "evidence": string }[], // see SKILLS below
    "openAIGaps": string[],               // see GAPS below
    "openAIImprovements": { "section": string, "issue": string, "suggestion": string }[], // see IMPROVEMENTS below
    "resumeInfo": ResumeInfo              // the tailored CV: the same JSON shape as <cv>, with every field and array item kept
}`,

        "FACTS THAT NEVER CHANGE\n" +
        "- Keep every workExperience item's companyName, jobTitle, website, dates and current flag exactly as written, " +
        "and keep the roles in their original order.\n" +
        "- Keep education, contactInfo, languages, hobbies and otherInterests exactly as written.\n" +
        "- Keep profile.firstName, profile.lastName and profile.profession exactly as written.\n" +
        "- Keep every project's projectName, role, link and dates exactly as written.\n" +
        "- Do not add any tool, technology, responsibility, achievement or number that <cv> doesn't support. " +
        "If the job asks for something the CV doesn't show, leave it out and list it under GAPS.\n" +
        "- Never raise the level of responsibility: \"assisted with\" must not become \"led\", " +
        "and \"worked with\" must not become \"designed\" or \"owned\".",

        "WHAT YOU MAY CHANGE\n" +
        "- workExperience[].duties: rewrite and reorder the bullets so the most relevant work for this job comes first.\n" +
        "- projects[].projectDetails: rewrite and reorder the bullets the same way.\n" +
        "- Lead each bullet with the part of the work this job cares about most (e.g. if the job stresses security and " +
        "a bullet says \"improved scalability, performance and security\", put security first).\n" +
        "- Use the job description's wording for things the candidate genuinely did (e.g. if they built " +
        "\"internal web apps\" and the job says \"line-of-business applications\", use the job's phrase).\n" +
        "- Name the specific technologies from <cv> that were used for each piece of work, where the CV supports it, " +
        "so the bullets are concrete. You may bring in a detail from elsewhere in the CV if it clearly belongs to that role.\n" +
        "- Merge bullets that repeat each other (e.g. two \"collaborated with\" bullets), and split a bullet that covers " +
        "two distinct pieces of work.\n" +
        "- projects: reorder so the most relevant project comes first.",

        "SKILLS\n" +
        "- Reorder resumeInfo.skills so the ones this job asks for come first. Keep every existing skill.\n" +
        "- Write every skill with its standard spelling and capitalisation (\"Typescript\" -> \"TypeScript\", " +
        "\"postgres\" -> \"PostgreSQL\", \"EF Core\" -> \"Entity Framework Core\"). Correcting a skill's spelling is not adding a skill.\n" +
        "- You may add a skill the job asks for only when <cv> clearly shows the candidate has it, for example: the job asks " +
        "for \"Azure\" and the CV says \"deployed to Azure\"; the job asks for \"CI/CD\" and the CV says \"built release " +
        "pipelines in Azure DevOps\". Use the job's name for the skill.\n" +
        "- For every skill you add, put an entry in openAIAddedSkills whose evidence is copied word for word from <cv>, " +
        "so it can be checked. If you can't quote the CV, don't add the skill.\n" +
        "- Only add concrete skills (languages, frameworks, platforms, practices such as TDD or Agile). " +
        "Don't add soft skills or broad claims such as \"Leadership\" or \"Large-scale systems\".",

        "HOW TO WRITE\n" +
        "- Each bullet says what was done, how (the technology) and the result or purpose, in one or two short sentences.\n" +
        "- Start each bullet with a clear past-tense verb (built, designed, automated, fixed, tested); use present tense " +
        "only for a current role.\n" +
        "- Make vague bullets (\"assisted with web development\") concrete using details from the CV, without overstating them.\n" +
        "- Every bullet must say what was built, changed, automated, fixed or delivered. A bullet that only says the candidate " +
        "\"collaborated with\", \"worked with\", \"was responsible for\" or \"helped\" with something must be rewritten around " +
        "the concrete work the CV mentions, or merged into a bullet that has it. Never keep a pure collaboration bullet.\n" +
        "- Prefer specifics the CV gives: app or product names, who used it, numbers, technologies.\n" +
        "- Follow PLAIN LANGUAGE below in every bullet and in the summary.\n" +
        "- Every bullet in a role must make a different point. If two bullets cover the same work, technology or outcome " +
        "(e.g. \"worked with Azure and AWS for deployment\" and \"hosted applications on AWS\"; or \"improved security\" and " +
        "\"improved scalability\" for the same apps), merge them into one bullet.\n" +
        "- Do not repeat the same bullet across roles.\n" +
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

        "GAPS\n" +
        "- openAIGaps lists the requirements from the job description that <cv> doesn't show, each as a short phrase " +
        "(e.g. \"Kubernetes\", \"Line management experience\"). Don't list anything you added under openAIAddedSkills. " +
        "Use an empty array if there are none.",

        "IMPROVEMENTS\n" +
        "- openAIImprovements lists the most valuable things only the candidate can fix in their own CV, most important first, " +
        "at most 6. For example: a role whose bullets are vague (ask which app or process, who used it, what changed, and any " +
        "numbers such as time saved or users); a project that mentions tests or a repository without counts or a link; " +
        "a degree written in a non-standard form (\"Masters\" instead of \"MSc\").\n" +
        "- section names the part of the CV (e.g. \"Ametek Taylor Hobson\", \"Projects\", \"Education\"); issue says what's weak " +
        "in one sentence; suggestion says exactly what to add, phrased as questions or a fill-in template. " +
        "Never supply the missing facts yourself.",

        "BEFORE YOU ANSWER\n" +
        "- Search the summary and every bullet for each word in the PLAIN LANGUAGE list, and rewrite any sentence that contains one.\n" +
        "- Compare the bullets within each role in pairs. Merge any two that make the same point, and rewrite any bullet " +
        "that doesn't say what was built, changed or delivered.\n" +
        "- Check every bullet against <cv>. If a bullet contains any tool, number, claim or responsibility not " +
        "supported by it, rewrite or remove it.\n" +
        "- Check that every fact listed under FACTS THAT NEVER CHANGE is identical to <cv>.\n" +
        "- Check that every openAIAddedSkills evidence is an exact quote from <cv>.",
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

// Added to the prompt depending on the "Tailor my summary" option.
export const SUMMARY_LOCKED_INSTRUCTION =
    "SUMMARY\n- Keep profile.summary exactly as written. Do not rewrite it.";

export const SUMMARY_TAILORED_INSTRUCTION =
    "SUMMARY\n" +
    "- Rewrite profile.summary in two or three sentences so it leads with what this job values most, " +
    "using only facts found in <cv> (technologies, years of experience if stated, education, kinds of work).\n" +
    "- No claims the CV doesn't support, no words from the PLAIN LANGUAGE list, and don't mention the hiring company by name.";
