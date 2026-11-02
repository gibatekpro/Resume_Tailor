import React from 'react';
import type { ResumeInfo } from "../../models/ResumeInfo";

export const SkillsSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return (
        <section className="cv-a-section cv-entry">
            <h2 className="cv-section-title">Skills</h2>
            <div className="cv-a-skills">
                {resumeData.skills?.map((skill, index) => (
                    <span key={index}>{skill}</span>
                ))}
            </div>
        </section>
    );
};
