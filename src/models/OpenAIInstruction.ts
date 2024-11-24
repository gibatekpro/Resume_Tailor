import {ResumeInfo} from "./ResumeInfo";

export interface OpenAIInstruction {
    prompt?: string[],
    responseFormat?: string,
    rules?: string[],
    jobDescriptionData?: string,
    resumeInfo?: ResumeInfo,
}
