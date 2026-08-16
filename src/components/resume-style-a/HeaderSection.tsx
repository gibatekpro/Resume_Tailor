import React, {useEffect} from 'react';
import '../../styles/resumeStyleA.css';
import {ResumeInfo} from "../../models/ResumeInfo";

export const HeaderSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {

    useEffect(() => {
    }, [resumeData]);

    return (
        <header className={"header-container"}>
            <h1>{resumeData.profile?.firstName}  {resumeData.profile?.lastName}</h1>
            <h1 style={{
                fontSize: '30px'
            }}>{resumeData.profile?.profession}</h1>
        </header>
    );
};