import React from 'react';
import type { ResumeInfo } from "../../models/ResumeInfo";
import {formatPeriod} from "../../utils/resumeFormat";

export const WorkExperienceSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return (
        <section className="cv-a-section">
            <h2 className="cv-section-title">Work Experience</h2>
            {resumeData.workExperience?.map((experience, index) => (
                <div key={index} className="cv-a-row cv-entry">
                    <div>
                        <h3>{experience.companyName}</h3>
                        <p className="cv-a-period">{formatPeriod(experience)}</p>
                    </div>
                    <div>
                        <p className="cv-a-role">{experience.jobTitle}</p>
                        {experience.duties.length > 0 && (
                            <ul className="cv-bullets">
                                {experience.duties.map((duty, dutyIndex) => (
                                    <li key={dutyIndex}>{duty}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            ))}
        </section>
    );
};
