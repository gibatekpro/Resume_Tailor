import React, {useEffect} from 'react';
import '../../styles/resumeStyleB.css';
import {useResumeProvider} from "../../context/ResumeContext";
import {ResumeInfo} from "../../models/ResumeInfo";

export const HeaderSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {

    useEffect(() => {
    }, [resumeData]);

    return (
        <header className={"header-container"}>
            <h1>{resumeData.profile?.firstName} {resumeData.profile?.lastName}</h1>
            <h2>{resumeData.profile?.profession}</h2>
        </header>
    );
};