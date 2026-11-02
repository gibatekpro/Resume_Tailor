import React, { useEffect, useRef, useState } from "react";
import type { JobApplicationInfo } from "../models/JobApplicationInfo";
import {APP_TITLE, LOCAL_STORAGE_APP_TITLE} from "../utils/applicationData";
import { useReactToPrint } from "react-to-print";
import STORAGE from "../utils/storage";
import {renderResumeStyle} from "../utils/HelperFunctions";

type ResumePrintPageProps = {
    setHideNavbar?: (hide: boolean) => void;
    setAppTitle?: React.Dispatch<React.SetStateAction<string>>;
};

export const ResumePrintPage: React.FC<ResumePrintPageProps> = ({ setHideNavbar, setAppTitle }) => {
    const [applicationData] = useState<JobApplicationInfo>(JSON.parse(localStorage.getItem(STORAGE.LOCAL_STORAGE_APPLICATION_DATA) || "{}"));
    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: applicationData.openAIDocumentTitle,
        onBeforePrint: async () => {
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

        setHideNavbar?.(true); // Hide Navbar when this page is loaded

        // Dynamically set the document title
        if (applicationData && applicationData.openAIDocumentTitle) {
            localStorage.setItem(LOCAL_STORAGE_APP_TITLE, applicationData.openAIDocumentTitle);
        }

        // Wait for the CV's web fonts, otherwise the PDF can fall back to system fonts and reflow.
        let timer: number | undefined;
        let cancelled = false;
        void document.fonts.ready.then(() => {
            if (!cancelled) {
                timer = window.setTimeout(() => handlePrint(), 400);
            }
        });

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
            setHideNavbar?.(false);
            localStorage.setItem(LOCAL_STORAGE_APP_TITLE, APP_TITLE);
            setAppTitle?.(APP_TITLE);
        };
    }, [setHideNavbar, applicationData]);

    return (
        <div className={"print-page-container w-full overflow-x-auto"}>
            <div ref={contentRef} className="pdf-container mx-auto">
                {/*<ResumeStyleA/>*/}
                {renderResumeStyle(applicationData?.resumeInfo || {}, applicationData.resumeStyle)}
            </div>
        </div>
    );
};
