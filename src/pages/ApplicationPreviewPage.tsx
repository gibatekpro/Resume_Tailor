import React, {useEffect, useRef, useState} from "react";
import {HeaderSection} from '../components/resume-style-a/HeaderSection';
import '../styles/resumePrint.css';
import {useNavigate} from "react-router-dom";
import {ResumeStyleA} from "../components/resume-style-a/ResumeStyleA";
import {ResumeStyleB} from "../components/resume-style-b/ResumeStyleB";
import JobApplicationService from "../services/JobApplicationService";
import {LOCAL_STORAGE_APPLICATION_DATA} from "../data/applicationData";
import {JobApplicationInfo} from "../models/JobApplicationInfo";
import ROUTES from "../data/routes";

export const ResumePreviewPage: React.FC<{ setHideNavbar: (hide: boolean) => void }> = ({ setHideNavbar }) => {
    const [user, setUser] = useState<string | null>(localStorage.getItem('user'));
    const [isLoading, setIsLoading] = useState(false);
    const [applicationData, setApplicationData] = useState<JobApplicationInfo>(JSON.parse(localStorage.getItem(LOCAL_STORAGE_APPLICATION_DATA) || "{}"))
    const navigate = useNavigate();

    const saveAndPrint = async () =>{
        try {
            await JobApplicationService.saveJobApplication(
                user ?? "", // Ensures `user` is never `null`, defaults to an empty string
                JSON.parse(localStorage.getItem(LOCAL_STORAGE_APPLICATION_DATA) || "{}")
            );
            setIsLoading(false);
            // alert("Job application saved successfully.");
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
                <div className="col-md-8">
                    {/*<ResumeStyleA/>*/}
                    <ResumeStyleB/>
                </div>
                <div className="col-md-4 mt-10 mt-md-0">
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
