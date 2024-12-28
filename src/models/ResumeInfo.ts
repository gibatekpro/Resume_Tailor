import {Education} from "./Education";
import {WorkExperience} from "./WorkExperience";
import {Language} from "./Language";
import {Project} from "./Project";
import {ContactInfo} from "./ContactInfo";

export interface ResumeInfo {
    resumeName?: string,
    profile?: {
        firstName?: string;
        lastName?: string;
        profession?: string;
        summary?: string;
    },
    contactInfo?: ContactInfo[],
    skills?: string[],
    workExperience?: WorkExperience[],
    projects?: Project[],
    education?: Education[],
    languages?: Language[],
    hobbies?: string[],
    otherInterests?: string[],

}