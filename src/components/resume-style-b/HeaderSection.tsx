import React, {useEffect} from 'react';
import '../../styles/resumeStyleB.css';
import {useResumeProvider} from "../../context/ResumeContext";

export const HeaderSection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();

    useEffect(() => {
    }, [resumeData]);

    return (
        <header className={"header-container"}>
            <h1>{resumeData.profile.firstName} {resumeData.profile.lastName}</h1>
            <h2>{resumeData.profile.profession}</h2>
        </header>
    );
};