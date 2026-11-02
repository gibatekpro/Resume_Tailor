import React from 'react';
import type { ResumeInfo } from "../../models/ResumeInfo";

export const SkillsSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return (
        <section className="cv-b-side-section">
            <h2>Skills</h2>
            {resumeData.skills?.map((skill, index) => (
                <p key={index}>{skill}</p>
            ))}
        </section>
    );
};
