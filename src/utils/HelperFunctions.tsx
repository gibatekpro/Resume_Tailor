import { ResumeInfo } from "../models/ResumeInfo";
import { ResumeStyleA } from "../components/resume-style-a/ResumeStyleA";
import { ResumeStyleB } from "../components/resume-style-b/ResumeStyleB";
import React from "react";
import {ResumeStyleC} from "../components/resume-style-c/ResumeStyleC";

export const renderResumeStyle = (resumeData: ResumeInfo, resumeStyle?: string) => {
    switch (resumeStyle) {
        case 'StyleA':
            return <ResumeStyleA resumeData={resumeData} />;
        case 'StyleB':
            return <ResumeStyleB resumeData={resumeData} />;
        case 'StyleC':
            return <ResumeStyleC resumeData={resumeData} />;
        default:
            return <ResumeStyleB resumeData={resumeData} />;
    }
};
