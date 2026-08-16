import {OpenAIInstruction} from "../models/OpenAIInstruction";

export const openAIInstruction: OpenAIInstruction = {
    prompt: [
        "Return a JSON object of this type:\n" +
        `
        interface JobApplicationInfo {
            openAIDocumentTitle?: string;
            openAIJobTitle?: string;
            openAIJobCompanyName?: string;
            openAIExpectedSalary?: string;
            openAIJobLocation?: string;
            openAISimpleJobDescription?: string;
            resumeInfo?: ResumeInfo;
        }
        `,
        "This is the model for resumeInfo (for reference purposes):\n" +
        `interface ResumeInfo {
    resumeName?: string,
    profile?: {
        firstName?: string;
        lastName?: string;
        profession?: string;
        summary?: string;
    },
    contactInfo?: ContactInfo[],
    skills?: string[],
    workExperience?: WorkExperience[],
    projects?: Project[],
    education?: Education[],
    languages?: Language[],
    hobbies?: string[],
    otherInterests?: string[],

}`,
        "Modify the resumeInfo object based on the provided job description requirements and follow the rules given below.",
        "Use the following guidelines strictly:",
        "- DO NOT INCLUDE backticks or the ```json annotation.",
        "- Ensure you read through the full job descriptions",
        "- Highlight ALL hard skills and Soft skills",
        "- Add ALL hard skills to 'resumeInfo.skills?: string[]'",
        "- Add SOME soft skills to 'resumeInfo.summary?: string[]'",
        "- Add Other soft skills to 'resumeInfo.projects?: Project[]' and 'resumeInfo.workExperience?: WorkExperience[]'",
        "- Fill missing objects labeled 'openAI' using the job description.",
        "- Document title format: `resumeInfo.firstName-resumeInfo.lastName-*company name`.",
        "- Use only the company name, e.g., 'john-doe-google-inc'.",
        "- Job title and roles must align with the job description.",
        "- Use clear, concise language for roles. Avoid unnecessary buzzwords.",
        "- Always feel free to change listed items (array contents) but not Company names and user's names",
    ],
    responseFormat: "JSON",
    rules: [
        "Do not alter first name, last name and profession",
        "Profile summary must match job description",
        "My work experience must match job description",
        "Ensure job title and roles match the description.",
        "Keep the company name where I worked unchanged.",
        "Profile section should remain unaltered.",
        "Generate 5 bullet points for work experience roles.",
    ],
    jobDescriptionData: "",
};