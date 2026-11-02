import type {ResumeInfo} from './ResumeInfo';
import type {GenerationInfo} from './GenerationInfo';
import type {CvImprovement, TailoringChanges} from './TailoringChanges';

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
    openAIAddedSkills?: unknown,      // raw AI suggestion; verified into tailoringChanges.addedSkills
    openAIImprovements?: CvImprovement[],
    generationInfo?: GenerationInfo,
    tailoringChanges?: TailoringChanges,
    resumeStyle?: string,
    resumeInfo?: ResumeInfo,
}