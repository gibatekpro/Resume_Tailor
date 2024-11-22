import {ResumeData} from "../models/ResumeData";

export interface ApplicationData{

    jobTitle?: string;
    jobType?: string;
    jobLocation?: string;
    salary?: string;
    companyName?: string;
    resumeData: ResumeData;
    applicationDate: string;

}

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
