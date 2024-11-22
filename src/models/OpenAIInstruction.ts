import {ResumeInfo} from "./ResumeInfo";

export interface OpenAIInstruction {
    openAIStrictInstructions?: string[],
    openAINote?: string[],
    jobDescriptionData?: string,
    resumeInfo?: ResumeInfo,
}
