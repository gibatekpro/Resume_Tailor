import {ResumeInfo} from "../models/ResumeInfo";
import {resumeData} from "./resumeData";

export const CustomResumeData: ResumeInfo = {
    workExperience: [...resumeData.workExperience || []],
    projects: [...resumeData.projects || []],
    skills: [...resumeData.skills || []],
    education: [...resumeData.education || []],
    languages: [...resumeData.languages || []],
    contactInfo: [...resumeData.contactInfo || []],
    profile: {...resumeData.profile},
};
