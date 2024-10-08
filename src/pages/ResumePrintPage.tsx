import React, {useEffect, useRef, useState} from "react";
import {HeaderSection} from '../components/resume-style-a/HeaderSection';
import '../styles/resumePrint.css';
import {useReactToPrint} from "react-to-print";
import {ResumeProvider, useResumeProvider} from "../context/ResumeContext";
import {useNavigate} from "react-router-dom";
import {ResumeStyleA} from "../components/resume-style-a/ResumeStyleA";
import {ResumeStyleB} from "../components/resume-style-b/ResumeStyleB";

export const ResumePrintPage: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();
    const {hideButton, setHideButton} = useResumeProvider();
    const contentRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const handlePrint = useReactToPrint({
        content: () => contentRef.current,
        documentTitle: resumeData.documentTitle,
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
        const timer = setTimeout(() => {
            handlePrint();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleNavigate = () => {
        // Navigate to a specific route
        navigate('/input'); // Replace '/your-route' with the desired path
    };

    return (
            <div className={"print-page-container"}>
                {/*{!hideButton && <div className={"button-container"}>*/}
                {/*    <button onClick={handlePrint}>Print</button>*/}
                {/*    <button onClick={handleNavigate}>Input Page</button>*/}
                {/*</div>}*/}
                <div ref={contentRef} className="pdf-container">
                    {/*<ResumeStyleA/>*/}
                    <ResumeStyleB/>
                </div>
            </div>
    );
};
