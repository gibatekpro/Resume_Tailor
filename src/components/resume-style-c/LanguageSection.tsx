import React from "react";
import type { ResumeInfo } from "../../models/ResumeInfo";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";


export const LanguageSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return (
        <section style={{...ResumeStyleCStyle.section, ...ResumeStyleCStyle.entry}}>
            <h2 className="cv-section-title" style={ResumeStyleCStyle.h2}>Languages</h2>
            <p style={ResumeStyleCStyle.text}>
                {resumeData.languages?.map((language, index) => (
                    <span key={index}>
                        {index > 0 && "  ·  "}
                        <span style={ResumeStyleCStyle.boldText}>{language.name}</span>
                        {language.proficiency && ` (${language.proficiency})`}
                    </span>
                ))}
            </p>
        </section>
    );

};
