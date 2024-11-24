import React, {useEffect} from 'react';
import '../../styles/resumeStyleB.css';
import {useResumeProvider} from "../../context/ResumeContext";
import {ResumeInfo} from "../../models/ResumeInfo";

export const HeaderSection: React.FC<{resumeDataOpenAI: ResumeInfo}> = ({resumeDataOpenAI}) => {

    useEffect(() => {
    }, [resumeDataOpenAI]);

    return (
        <header className={"header-container"}>
            <h1>{resumeDataOpenAI.profile?.firstName} {resumeDataOpenAI.profile?.lastName}</h1>
            <h2>{resumeDataOpenAI.profile?.profession}</h2>
        </header>
    );
};