import React from 'react';
import type { ResumeInfo } from "../../models/ResumeInfo";

export const LanguageSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return (
        <section className="cv-b-side-section">
            <h2>Languages</h2>
            {resumeData.languages?.map((language, index) => (
                <p key={index}>
                    {language.name}{language.proficiency ? ` – ${language.proficiency}` : ""}
                </p>
            ))}
        </section>
    );
};
