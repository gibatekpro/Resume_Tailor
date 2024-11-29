import {Education} from "./Education";
import {WorkExperience} from "./WorkExperience";
import {Language} from "./Language";
import {Project} from "./Project";
import {ContactInfo} from "./ContactInfo";

export interface ResumeInfo {
    profile?: {
        firstName?: string;
        lastName?: string;
        profession?: string;
        summary?: string;
    },
    skills?: string[],
    education?: Education[],
    workExperience?: WorkExperience[],
    languages?: Language[],
    projects?: Project[],
    contactInfo?: ContactInfo[]
    hobbies?: string[],
    otherInterests?: string[],

}