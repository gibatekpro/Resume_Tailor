import type {ResumeInfo} from './ResumeInfo';

export interface OpenAIInstruction {
    prompt?: string[],
    responseFormat?: string,
    rules?: string[],
    jobDescriptionData?: string,
    model?: string,
    resumeInfo?: ResumeInfo,
}
