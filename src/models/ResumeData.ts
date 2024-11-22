import {WorkExperience} from "./WorkExperience";
import {Education} from "./Education";
import {Project} from "./Project";
import {ContactInfo} from "./ContactInfo";
import {Language} from "./Language";

export interface ResumeData {
    openAINote?: string,
    jobDescriptionData?: string,
    openAIJobTitle?: string,
    openAIExpectedSalary?: string,
    openAIJobLocation?: string,
    openAISimpleJobDescription?: string,
    documentTitle: string,
    profile: {
        firstName?: string,
        lastName?: string,
        profession?: string,
        summary?: string,
        linkedin?: string,
        website?: string,
        city?: string,
        country?: string,
        phone?: string,
        email?: string,
    },
    languages: Language[]
    contactInfo: ContactInfo[]
    summary: string,
    skills: string[];
    workExperience: WorkExperience[];
    education: Education[];
    projects: Project[];
}