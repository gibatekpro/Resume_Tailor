import React, {useEffect} from 'react';
import {useResumeProvider} from "../../context/ResumeContext";

export const HeaderSection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();

    useEffect(() => {
    }, [resumeData]);

    return (
        <header className={"header-container"}>
            <h1>{resumeData.profile.firstName}</h1>
            <h1>{resumeData.profile.lastName}</h1>
        </header>
    );
};