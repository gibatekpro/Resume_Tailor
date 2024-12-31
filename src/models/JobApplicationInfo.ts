import {OpenAIInstruction} from "./OpenAIInstruction";
import {ResumeInfo} from "./ResumeInfo";
import moment from "moment";

export interface JobApplicationInfo {
    openAIDocumentTitle?: string,
    date?: moment.Moment,
    openAIJobTitle?: string,
    openAIJobCompanyName?: string,
    openAIExpectedSalary?: string,
    openAIJobLocation?: string,
    openAISimpleJobDescription?: string,
    resumeStyle?: string,
    resumeInfo?: ResumeInfo,
}