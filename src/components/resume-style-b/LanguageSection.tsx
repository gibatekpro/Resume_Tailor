import React, {useEffect} from 'react';
import '../../styles/resumeStyleB.css';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";

export const LanguageSection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();
    useEffect(()=>{

    },[resumeData]);

    return (
        <div>
            <h2>Languages</h2>
            {resumeData?.languages?.length > 0 ? (
                resumeData.languages.map((language, index) => (
                    <p key={index}>{language.name} - {language.level}</p>
                ))
            ) : (
                <p>No languages available</p> // Fallback when there are no languages
            )}
        </div>
    );
};

