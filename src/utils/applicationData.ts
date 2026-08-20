import type {ResumeData} from "../models/ResumeData";

export interface ApplicationData{

    jobTitle?: string;
    jobType?: string;
    jobLocation?: string;
    salary?: string;
    companyName?: string;
    resumeData: ResumeData;
    applicationDate: string;

}

export const APP_TITLE:string = "Resume Tailor"

export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const RESUME_STYLES = [
    "StyleA",
    "StyleB",
    "StyleC",
];

export const YEARS = Array.from(
    { length: 50 },
    (_, i) => new Date().getFullYear() - i
);


export const appName = "Resume Tailor"
export const LOCAL_STORAGE_APP_TITLE: string = "Resume Tailor"

export const textColor = '#232e53';