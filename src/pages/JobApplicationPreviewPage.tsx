import React, {useEffect, useRef, useState} from "react";
import {HeaderSection} from '../components/resume-style-a/HeaderSection';
import '../styles/resumePrint.css';
import {useNavigate} from "react-router-dom";
import {ResumeStyleA} from "../components/resume-style-a/ResumeStyleA";
import {ResumeStyleB} from "../components/resume-style-b/ResumeStyleB";
import JobApplicationService from "../services/JobApplicationService";
import {
    APP_TITLE,
    LOCAL_STORAGE_APP_TITLE,
    LOCAL_STORAGE_APPLICATION_DATA,
    LOCAL_STORAGE_RESUME_DATA
} from "../data/applicationData";
import {JobApplicationInfo} from "../models/JobApplicationInfo";
import ROUTES from "../data/routes";
import {DefaultResumeData} from "../data/defaultResumeData";

export const JobApplicationPreviewPage: React.FC<{ setHideNavbar: (hide: boolean) => void, setAppTitle:React.Dispatch<React.SetStateAction<string>> }> = ({ setHideNavbar, setAppTitle }) => {
    const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
    const [isLoading, setIsLoading] = useState(false);
    const [applicationData, setApplicationData] = useState<JobApplicationInfo>(JSON.parse(localStorage.getItem(LOCAL_STORAGE_APPLICATION_DATA) || "{}"));
    const [theAppTitle, setTheAppTitle] = useState<string>(JSON.parse(localStorage.getItem(LOCAL_STORAGE_APPLICATION_DATA) || "{}").openAIDocumentTitle);
    const navigate = useNavigate();
    const saved = localStorage.getItem(LOCAL_STORAGE_RESUME_DATA);
    const resumeDataOpenAI = saved ? JSON.parse(saved) : DefaultResumeData;

    const saveAndPrint = async () =>{
        try {
            const theApplicationData: JobApplicationInfo = JSON.parse(localStorage.getItem(LOCAL_STORAGE_APPLICATION_DATA) || "{}");
            await JobApplicationService.saveJobApplication(
                user ?? "", theApplicationData
            );
            setAppTitle(theApplicationData.openAIDocumentTitle || APP_TITLE)
            setIsLoading(false);
            setHideNavbar(true); // Ensure Navbar is hidden before navigating
            navigate(ROUTES.RESUME_PRINT_PAGE);
        } catch (error) {
        }

    }

    return (
        <div className={"print-page-container"}>
            {/*{!hideButton && <div className={"button-container"}>*/}
            {/*    <button onClick={handlePrint}>Print</button>*/}
            {/*    <button onClick={handleNavigate}>Input Page</button>*/}
            {/*</div>}*/}
            <div className="row g-1 p-2 p-md-0 my-32">
                <div className="col-md-6">
                    {/*<ResumeStyleA/>*/}
                    <ResumeStyleB resumeData={resumeDataOpenAI}/>
                </div>
                <div className="col-md-6 mt-10 mt-md-0">
                    <div
                        className="position-sticky d-flex justify-content-center align-items-center"
                        style={{
                            top: "2rem",
                            height: "100vh" // Ensures the div takes the full viewport height for centering
                        }}
                    >
                        <button
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "100px",
                                height: "100px",
                                fontSize: "16px",
                                cursor: "pointer"
                            }}
                            onClick={saveAndPrint}
                        >
                            Save Application
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
