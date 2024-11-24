import React, {useEffect} from 'react';
import '../../styles/resumeStyleB.css';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";
import {ResumeInfo} from "../../models/ResumeInfo";

export const LanguageSection: React.FC<{resumeDataOpenAI: ResumeInfo}> = ({resumeDataOpenAI}) => {
    useEffect(()=>{

    },[resumeDataOpenAI]);

    return (
        <div>
            <h2>Languages</h2>
            {resumeDataOpenAI.languages && resumeDataOpenAI.languages.length > 0 ? (
                resumeDataOpenAI.languages.map((language, index) => (
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

