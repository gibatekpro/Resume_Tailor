import {OpenAIInstruction} from "./OpenAIInstruction";
import {ResumeInfo} from "./ResumeInfo";
import moment from "moment";

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