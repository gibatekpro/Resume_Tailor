import type {Education} from "./Education";
import type {WorkExperience} from "./WorkExperience";
import type {Language} from "./Language";
import type {Project} from "./Project";
import type {ContactInfo} from "./ContactInfo";

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