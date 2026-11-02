import React from 'react';
import type { ResumeInfo } from "../../models/ResumeInfo";
import {formatPeriod} from "../../utils/resumeFormat";

export const WorkExperienceSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return (
        <section className="cv-b-section">
            <h2 className="cv-section-title">Work Experience</h2>
            {resumeData.workExperience?.map((experience, index) => (
                <div key={index} className="cv-b-entry cv-entry">
                    <div className="cv-b-entry-head">
                        <h3>{experience.jobTitle}</h3>
                        <span className="cv-b-period">{formatPeriod(experience)}</span>
                    </div>
                    <p className="cv-b-subtitle">{experience.companyName}</p>
                    {experience.duties.length > 0 && (
                        <ul className="cv-bullets">
                            {experience.duties.map((duty, dutyIndex) => (
                                <li key={dutyIndex}>{duty}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </section>
    );
};
