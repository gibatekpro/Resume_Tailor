import React, {useEffect} from 'react';
import '../../styles/resumeStyleB.css';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";
import {ResumeInfo} from "../../models/ResumeInfo";

export const LanguageSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    useEffect(()=>{

    },[resumeData]);

    return (
        <div>
            <h2>Languages</h2>
            {resumeData.languages && resumeData.languages.length > 0 ? (
                resumeData.languages.map((language, index) => (
                    <p key={index}>
                        {language.name} - {language.proficiency}
                    </p>
                ))
            ) : (
                <p>No languages available</p> // Fallback when there are no languages
            )}
        </div>
    );

};

