import React, {useEffect} from "react";
import {ResumeInfo} from "../../models/ResumeInfo";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";


export const LanguageSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    useEffect(()=>{

    },[resumeData]);

    return (
        <div>
            <h2 style={{
                ...ResumeStyleCStyle.h2,
                ...ResumeStyleCStyle.boldText,
                ...ResumeStyleCStyle.initialCaps
            }}>Languages</h2>
            <div style={{
                ...ResumeStyleCStyle.mediumSpacing
            }}></div>
            {resumeData.languages && resumeData.languages.length > 0 ? (
                resumeData.languages.map((language, index) => (
                    <div key={index}>
                        <span style={{
                            ...ResumeStyleCStyle.text,
                            ...ResumeStyleCStyle.boldText,
                        }}>{language.name}</span>
                        <span style={{
                            ...ResumeStyleCStyle.text,
                        }}> ({language.proficiency})</span>
                    </div>

                ))
            ) : (
                <p>No languages available</p>
            )}
        </div>
    );

};
