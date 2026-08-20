import type {ResumeInfo} from './ResumeInfo';

export interface JobApplicationInfo {
    date?: string,
    jobPostingUrl?: string,
    openAIDocumentTitle?: string,
    openAIJobTitle?: string,
    openAIJobCompanyName?: string,
    openAIExpectedSalary?: string,
    openAIJobLocation?: string,
    openAISimpleJobDescription?: string,
    resumeStyle?: string,
    resumeInfo?: ResumeInfo,
}