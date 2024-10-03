import {WorkExperience} from "./WorkExperience";
import {Education} from "./Education";
import {Project} from "./Project";
import {ContactInfo} from "./ContactInfo";

export interface ResumeData {
    documentTitle: string,
    profile: {
        firstName: string,
        lastName: string
    },
    contactInfo: ContactInfo[]
    summary: string,
    skills: string[];
    workExperience: WorkExperience[];
    education: Education[];
    projects: Project[];
}