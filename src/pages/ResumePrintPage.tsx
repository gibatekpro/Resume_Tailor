import React, {useEffect, useRef, useState} from "react";
import {HeaderSection} from '../components/resume-style-a/HeaderSection';
import '../styles/resumePrint.css';
import {useReactToPrint} from "react-to-print";
import {ResumeProvider, useResumeProvider} from "../context/ResumeContext";
import {useNavigate} from "react-router-dom";
import {ResumeStyleA} from "../components/resume-style-a/ResumeStyleA";

export const ResumePrintPage: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();
    const contentRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const handlePrint = useReactToPrint({
        content: () => contentRef.current,
        documentTitle: resumeData.documentTitle,
        onBeforePrint: () => {
        },
        onAfterPrint: () => {
        },
        onPrintError: (errorLocation, error) => {
            console.error('Print error:', errorLocation, error);
        },
    });

    const handleNavigate = () => {
        // Navigate to a specific route
        navigate('/input'); // Replace '/your-route' with the desired path
    };

    return (
            <div>
                <div>
                    <button onClick={handlePrint}>Print</button>
                    <button onClick={handleNavigate}>Input Page</button>
                </div>
                <div ref={contentRef} className="print-page-container">
                    <ResumeStyleA/>
                </div>
            </div>
    );
};
