import React from 'react';
import type { ResumeInfo } from "../../models/ResumeInfo";
import {educationTitle, formatPeriod} from "../../utils/resumeFormat";

export const EducationSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return (
        <section className="cv-b-section">
            <h2 className="cv-section-title">Education</h2>
            {resumeData.education?.map((education, index) => (
                <div key={index} className="cv-b-entry cv-entry">
                    <div className="cv-b-entry-head">
                        <h3>
                            {education.link ? (
                                <a href={education.link} target="_blank" rel="noopener noreferrer">{education.institutionName}</a>
                            ) : (
                                education.institutionName
                            )}
                        </h3>
                        <span className="cv-b-period">{formatPeriod(education)}</span>
                    </div>
                    <p>{educationTitle(education)}</p>
                </div>
            ))}
        </section>
    );
};
