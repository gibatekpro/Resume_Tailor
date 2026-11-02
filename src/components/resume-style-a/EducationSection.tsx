import React from 'react';
import type { ResumeInfo } from "../../models/ResumeInfo";
import {educationTitle, formatPeriod} from "../../utils/resumeFormat";

export const EducationSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return (
        <section className="cv-a-section">
            <h2 className="cv-section-title">Education</h2>
            {resumeData.education?.map((education, index) => (
                <div key={index} className="cv-a-row cv-entry">
                    <div>
                        <h3>
                            {education.link ? (
                                <a href={education.link} target="_blank" rel="noopener noreferrer">{education.institutionName}</a>
                            ) : (
                                education.institutionName
                            )}
                        </h3>
                        <p className="cv-a-period">{formatPeriod(education)}</p>
                    </div>
                    <div>
                        <p className="cv-a-role">{educationTitle(education)}</p>
                    </div>
                </div>
            ))}
        </section>
    );
};
