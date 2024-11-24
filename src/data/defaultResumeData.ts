import {ResumeInfo} from "../models/ResumeInfo";

export const DefaultResumeData: ResumeInfo = {
    workExperience: [
        {
            companyName: "",
            jobTitle: "",
            duties: [
                ""
            ],
            startMonth: "",
            startYear: "",
            endMonth: "",
            endYear: "",
            current: false
        },
    ],
    projects: [
        {
            projectName: "",
            role: "",
            projectDetails: [
                ""
            ],
            startMonth: "",
            startYear: "",
            endMonth: "",
            endYear: "",
            current: false,
            link: ""
        }
    ],
    skills: [
        ""
    ],
    education: [
        {
            institutionName: "",
            degree: "",
            course: "",
            startMonth: "",
            startYear: "",
            endMonth: "",
            endYear: "",
            current: false,
            link: ""
        },
    ],
    languages: [
        {
            name: "",
            proficiency: ""
        }
    ],
    contactInfo: [
        {
            infoTitle: "",
            infoDetails: "",
        }
    ],
    profile: {
        firstName: "",
        lastName: "",
        profession: "",
        summary: "",
    },
};