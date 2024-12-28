import {OpenAIInstruction} from "../models/OpenAIInstruction";
import {openAIInstruction} from "./openAIInstruction";
import STORAGE from "./storage";

export const InstructionResumeData: OpenAIInstruction = {
    prompt: openAIInstruction.prompt || [],
    responseFormat: openAIInstruction.responseFormat || "JSON",
    rules: openAIInstruction.rules || [
        ""
    ],
};