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

export const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "resume-tailored.firebaseapp.com",
    projectId: "resume-tailored",
    storageBucket: "resume-tailored.firebasestorage.app",
    messagingSenderId: "414343592918",
    appId: "1:414343592918:web:f7aee24156b6ec61800277",
    measurementId: "G-P6PC7L9W80"
};


export const appName = "Resume Tailor"
export const LOCAL_STORAGE_APP_TITLE: string = "Resume Tailor"

export const textColor = '#232e53';