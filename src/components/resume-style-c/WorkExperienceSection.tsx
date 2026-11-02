import React from "react";
import type { ResumeInfo } from "../../models/ResumeInfo";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";
import {formatPeriod} from "../../utils/resumeFormat";


export const WorkExperienceSection: React.FC<{ resumeData: ResumeInfo }> = ({resumeData}) => {
    return (
        <section style={ResumeStyleCStyle.section}>
            <h2 className="cv-section-title" style={ResumeStyleCStyle.h2}>Work Experience</h2>
            {resumeData.workExperience?.map((experience, index) => (
                <div key={index} className="cv-entry" style={ResumeStyleCStyle.entry}>
                    <div style={ResumeStyleCStyle.entryHead}>
                        <h4 style={ResumeStyleCStyle.h4}>
                            {experience.jobTitle}
                            <span style={{...ResumeStyleCStyle.mutedText, fontWeight: 400}}> · {experience.companyName}</span>
                        </h4>
                        <span style={ResumeStyleCStyle.period}>{formatPeriod(experience)}</span>
                    </div>
                    {experience.duties.length > 0 && (
                        <ul className="cv-bullets" style={ResumeStyleCStyle.bullets}>
                            {experience.duties.map((duty, dutyIndex) => (
                                <li key={dutyIndex} style={ResumeStyleCStyle.bullet}>{duty}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </section>
    );

};
