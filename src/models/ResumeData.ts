import {WorkExperience} from "./WorkExperience";
import {Education} from "./Education";
import {Project} from "./Project";
import {ContactInfo} from "./ContactInfo";
import {Language} from "./Language";

export interface ResumeData {
    documentTitle: string,
    profile: {
        firstName: string,
        lastName: string,
        profession: string
    },
    languages: Language[]
    contactInfo: ContactInfo[]
    summary: string,
    skills: string[];
    workExperience: WorkExperience[];
    education: Education[];
    projects: Project[];
}