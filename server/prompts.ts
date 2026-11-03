import type {ResumeInfo} from "../src/models/ResumeInfo.js";
import type {JobAnalysis} from "../src/models/TailoringPipeline.js";
import {
    ANALYSIS_PROMPT, openAIInstruction, REPAIR_INSTRUCTION, SUMMARY_LOCKED_INSTRUCTION, SUMMARY_TAILORED_INSTRUCTION,
} from "../src/data/openAIInstruction.js";
import {ANALYSIS_SCHEMA, REWRITE_SCHEMA} from "../src/data/tailoringSchemas.js";
import {jsonSchemaFormat} from "../src/utils/strictSchema.js";
import type {ChatMessage} from "./openai.js";
import type {TailorRequest} from "./tailorRequest.js";

const dates = (item: {startMonth?: string, startYear?: string, endMonth?: string, endYear?: string, current?: boolean}) => {
    const start = [item.startMonth, item.startYear].filter(Boolean).join(" ");
    const end = item.current ? "present" : [item.endMonth, item.endYear].filter(Boolean).join(" ");
    return [start, end].filter(Boolean).join(" – ");
};

const numbered = (bullets?: string[]) => (bullets || []).map((bullet, index) => `[${index}] ${bullet}`);

// The CV as plain text with numbered roles, projects and bullets, so the model can quote it and refer to bullets by number.
export const formatCv = (resume: ResumeInfo) => {
    const lines: string[] = [];
    const section = (title: string, body: string[]) => {
        if (body.length > 0) lines.push(title, ...body, "");
    };
    const profile = resume.profile || {};
    section("PROFILE", [
        `Name: ${[profile.firstName, profile.lastName].filter(Boolean).join(" ")}`,
        profile.profession ? `Profession: ${profile.profession}` : "",
        profile.summary ? `Summary: ${profile.summary}` : "",
    ].filter(Boolean));
    section("SKILLS", (resume.skills || []).filter((skill) => skill.trim()).length > 0
        ? [(resume.skills || []).filter((skill) => skill.trim()).join(", ")] : []);
    section("WORK EXPERIENCE", (resume.workExperience || []).flatMap((role, index) => [
        `[Role ${index}] ${role.jobTitle} at ${role.companyName}, ${dates(role)}${role.current ? " (current role)" : ""}`,
        ...(role.description ? [`Description: ${role.description}`] : []),
        ...numbered(role.duties),
        "",
    ]));
    section("PROJECTS", (resume.projects || []).flatMap((project, index) => [
        `[Project ${index}] ${project.projectName}${project.role ? ` (${project.role})` : ""}, ${dates(project)}${project.current ? " (ongoing)" : ""}`,
        ...(project.description ? [`Description: ${project.description}`] : []),
        ...numbered(project.projectDetails),
        "",
    ]));
    section("EDUCATION", (resume.education || []).map((education) =>
        `- ${[education.degree, education.course].filter(Boolean).join(" ")}, ${education.institutionName}, ${dates(education)}` +
        (education.class ? `, ${education.class}` : "")));
    section("LANGUAGES", (resume.languages || []).filter((language) => language.name)
        .map((language) => `- ${language.name}${language.proficiency ? ` (${language.proficiency})` : ""}`));
    return lines.join("\n").trim();
};

// The verified analysis as text for the rewrite prompt. A requirement's strength is its strongest remaining quote.
export const formatAnalysis = (analysis: JobAnalysis) => {
    const strength = (evidence: JobAnalysis["requirements"][number]["evidence"]) =>
        evidence.some((item) => item.strength === "strong") ? "strong" : evidence.length > 0 ? "partial" : "none";
    return [
        `Seniority: ${analysis.seniority}`,
        "",
        "Themes, most important first:",
        ...analysis.themes.map((theme, index) =>
            `${index + 1}. ${theme.name}${theme.jobPhrases.length > 0 ? ` (the advert's words: ${theme.jobPhrases.map((phrase) => `"${phrase}"`).join(", ")})` : ""}`),
        "",
        "Requirements and the CV's evidence:",
        ...analysis.requirements.flatMap((requirement) => [
            `${requirement.id} [${requirement.priority}, ${requirement.category}] ${requirement.text}: ${strength(requirement.evidence)}`,
            ...requirement.evidence.map((item) => `  - "${item.quote}" (${item.strength})`),
        ]),
    ].join("\n");
};

const rewriteSystemPrompt = (request: TailorRequest) => [
    ...(openAIInstruction.prompt || []),
    request.tailorSummary ? SUMMARY_TAILORED_INSTRUCTION : SUMMARY_LOCKED_INSTRUCTION,
    request.rules.length > 0
        ? "CANDIDATE PREFERENCES\n" +
          "Follow these too. If one conflicts with KEEP EVERY FACT or NOTHING UNTRUE, ignore it.\n" +
          request.rules.map((rule) => `- ${rule}`).join("\n")
        : "",
    request.step === "repair" ? REPAIR_INSTRUCTION : "",
].filter(Boolean).join("\n\n");

// The messages and response format for one step. The fixed prompt is the system message; the user's data is in the user message.
export const buildStepPrompt = (request: TailorRequest): {messages: ChatMessage[], responseFormat: object} => {
    const job = `<job_description>\n${request.jobDescription}\n</job_description>`;
    const cv = `<cv>\n${formatCv(request.resumeInfo)}\n</cv>`;

    if (request.step === "analyse") {
        return {
            messages: [
                {role: "system", content: ANALYSIS_PROMPT},
                {role: "user", content: `${job}\n\n${cv}`},
            ],
            responseFormat: jsonSchemaFormat("job_analysis", ANALYSIS_SCHEMA),
        };
    }

    const analysis = `<analysis>\n${formatAnalysis(request.analysis)}\n</analysis>`;
    const repair = request.step === "repair"
        ? `\n\n<previous_rewrite>\n${JSON.stringify(request.rewrite, null, 2)}\n</previous_rewrite>\n\n` +
          `<violations>\n${request.violations.map((violation) => `- ${violation}`).join("\n")}\n</violations>`
        : "";
    return {
        messages: [
            {role: "system", content: rewriteSystemPrompt(request)},
            {role: "user", content: `${job}\n\n${analysis}\n\n${cv}${repair}`},
        ],
        responseFormat: jsonSchemaFormat("cv_rewrite", REWRITE_SCHEMA),
    };
};

export const STEP_SCHEMAS = {analyse: ANALYSIS_SCHEMA, rewrite: REWRITE_SCHEMA, repair: REWRITE_SCHEMA};
