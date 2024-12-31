import { ResumeInfo } from "../models/ResumeInfo";
import { ResumeStyleA } from "../components/resume-style-a/ResumeStyleA";
import { ResumeStyleB } from "../components/resume-style-b/ResumeStyleB";
import React from "react";

export const renderResumeStyle = (resumeData: ResumeInfo, resumeStyle?: string) => {
    switch (resumeStyle) {
        case 'StyleA':
            return <ResumeStyleA resumeData={resumeData} />;
        case 'StyleB':
            return <ResumeStyleB resumeData={resumeData} />;
        default:
            return <ResumeStyleB resumeData={resumeData} />;
    }
};
