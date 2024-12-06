import {JobApplicationInfo} from "./JobApplicationInfo";
import {ResumeInfo} from "./ResumeInfo";

export interface SavedResumesResponse {
    id?: string,
    data: ResumeInfo,
}