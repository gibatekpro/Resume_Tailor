import {OpenAIInstruction} from "./OpenAIInstruction";
import {ResumeInfo} from "./ResumeInfo";

export interface JobApplicationInfo {
    openAIJobTitle?: string,
    openAIExpectedSalary?: string,
    openAIJobLocation?: string,
    openAISimpleJobDescription?: string,
    resumeInfo?: ResumeInfo,
}