import {OpenAIInstruction} from "../models/OpenAIInstruction";

export const openAIInstruction: OpenAIInstruction = {
    openAIStrictInstructions: [
        "STRICT: Produce ONLY JSON,  with NO OPEN AI comments or explanations at all. STRICT: PRODUCE ONLY JSON.",
        "DO NOT INCLUDE this ```json or any backticks at all",
        "Note to OpenAI: Use the Job description to alter this json and produce another one",
        "Fill in the missing objects that have openAI in them using the job description",
        "STRICT: The JSON should be of this type interface JobApplicationInfo {\n" +
        "    openAIJobTitle?: string,\n" +
        "    openAIExpectedSalary?: string,\n" +
        "    openAIJobLocation?: string,\n" +
        "    openAISimpleJobDescription?: string,\n" +
        "    resumeInfo?: ResumeInfo,\n" +
        "}"
    ],
    openAINote: [
        "Document title should be anthony-gibah-*company name",
        "Add only company name, not description. e.g anthony-gibah-google-inc"
    ],
    jobDescriptionData: "",
}