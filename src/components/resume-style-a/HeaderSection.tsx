import React, {useEffect} from 'react';
import {useResumeProvider} from "../../context/ResumeContext";
import '../../styles/resumeStyleA.css';
import {ResumeInfo} from "../../models/ResumeInfo";

export const HeaderSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {

    useEffect(() => {
    }, [resumeData]);

    return (
        <header className={"header-container"}>
            <h1>{resumeData.profile?.firstName}</h1>
            <h1>{resumeData.profile?.lastName}</h1>
        </header>
    );
};