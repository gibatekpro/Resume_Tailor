import {OpenAIInstruction} from "../models/OpenAIInstruction";
import {openAIInstruction} from "./openAIInstruction";

export const InstructionResumeData: OpenAIInstruction = {
    prompt: openAIInstruction.prompt || [],
    responseFormat: openAIInstruction.responseFormat || "JSON",
    rules: openAIInstruction.rules || [
        ""
    ],
    jobDescriptionData: openAIInstruction.jobDescriptionData || "",
};