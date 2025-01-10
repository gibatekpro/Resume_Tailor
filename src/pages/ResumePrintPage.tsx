import React, { useEffect, useRef, useState } from "react";
import { ResumeProvider, useResumeProvider } from "../context/ResumeContext";
import { useNavigate } from "react-router-dom";
import { ResumeStyleA } from "../components/resume-style-a/ResumeStyleA";
import { ResumeStyleB } from "../components/resume-style-b/ResumeStyleB";
import { JobApplicationInfo } from "../models/JobApplicationInfo";
import {APP_TITLE, LOCAL_STORAGE_APP_TITLE} from "../data/applicationData";
import { useReactToPrint } from "react-to-print";
import {ResumeInfo} from "../models/ResumeInfo";
import STORAGE from "../data/storage";
import {renderResumeStyle} from "../utils/HelperFunctions";

export const ResumePrintPage: React.FC<{ setHideNavbar: (hide: boolean) => void, setAppTitle:React.Dispatch<React.SetStateAction<string>> }> = ({ setHideNavbar, setAppTitle }) => {
    const [applicationData, setApplicationData] = useState<JobApplicationInfo>(JSON.parse(localStorage.getItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA) || "{}"));
    const contentRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handlePrint = useReactToPrint({
        content: () => contentRef.current,
        documentTitle: applicationData.openAIDocumentTitle,
        onBeforePrint: () => {
            // setHideButton(true);
        },
        onAfterPrint: () => {
            // setHideButton(false);
        },
        onPrintError: (errorLocation, error) => {
            console.error('Print error:', errorLocation, error);
        },
    });

    useEffect(() => {

        console.log("Print === Updated Data >>>>>: " + applicationData.jobPostingUrl);

        setHideNavbar(true); // Hide Navbar when this page is loaded

        // Dynamically set the document title
        if (applicationData && applicationData.openAIDocumentTitle) {
            localStorage.setItem(LOCAL_STORAGE_APP_TITLE, applicationData.openAIDocumentTitle);
        }

        setTimeout(() => {
            handlePrint();
        }, 3000);

        return () => {
            setHideNavbar(false);
            localStorage.setItem(LOCAL_STORAGE_APP_TITLE, APP_TITLE);
            setAppTitle(APP_TITLE);
        };
    }, [setHideNavbar, applicationData]);

    return (
        <div className={"print-page-container"}>
            <div ref={contentRef} className="pdf-container">
                {/*<ResumeStyleA/>*/}
                {renderResumeStyle(applicationData?.resumeInfo || {}, applicationData.resumeStyle)}
            </div>
        </div>
    );
};
