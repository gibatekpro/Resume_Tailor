import React from "react";
import type { ResumeInfo } from "../../models/ResumeInfo";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";
import {educationTitle, formatPeriod} from "../../utils/resumeFormat";


export const EducationSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return (
        <section style={ResumeStyleCStyle.section}>
            <h2 className="cv-section-title" style={ResumeStyleCStyle.h2}>Education</h2>
            {resumeData.education?.map((education, index) => (
                <div key={index} className="cv-entry" style={ResumeStyleCStyle.entry}>
                    <div style={ResumeStyleCStyle.entryHead}>
                        <h4 style={ResumeStyleCStyle.h4}>
                            {educationTitle(education)}
                            <span style={{...ResumeStyleCStyle.mutedText, fontWeight: 400}}>
                                {" · "}
                                {education.link ? (
                                    <a href={education.link} target="_blank" rel="noopener noreferrer">{education.institutionName}</a>
                                ) : (
                                    education.institutionName
                                )}
                            </span>
                        </h4>
                        <span style={ResumeStyleCStyle.period}>{formatPeriod(education)}</span>
                    </div>
                </div>
            ))}
        </section>
    );
};
