import React, {useEffect} from 'react';
import {useResumeProvider} from "../../context/ResumeContext";
import '../../styles/resumeStyleA.css';
import {ResumeInfo} from "../../models/ResumeInfo";
import {fontWeight} from "html2canvas/dist/types/css/property-descriptors/font-weight";

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