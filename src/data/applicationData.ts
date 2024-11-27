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

export const LOCAL_STORAGE_RESUME_DATA: string = "LOCAL_STORAGE_RESUME_DATA"
export const LOCAL_STORAGE_APPLICATION_DATA: string = "LOCAL_STORAGE_APPLICATION_DATA"
