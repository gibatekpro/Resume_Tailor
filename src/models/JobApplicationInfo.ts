import type {ResumeInfo} from './ResumeInfo';
import type {GenerationInfo} from './GenerationInfo';

export interface JobApplicationInfo {
    date?: string,
    jobPostingUrl?: string,
    openAIDocumentTitle?: string,
    openAIJobTitle?: string,
    openAIJobCompanyName?: string,
    openAIExpectedSalary?: string,
    openAIJobLocation?: string,
    openAISimpleJobDescription?: string,
    openAIGaps?: string[],
    generationInfo?: GenerationInfo,
    resumeStyle?: string,
    resumeInfo?: ResumeInfo,
}