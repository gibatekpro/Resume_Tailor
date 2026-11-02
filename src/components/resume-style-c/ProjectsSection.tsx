import React from "react";
import type { ResumeInfo } from "../../models/ResumeInfo";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";
import {formatPeriod} from "../../utils/resumeFormat";


export const ProjectsSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return (
        <section style={ResumeStyleCStyle.section}>
            <h2 className="cv-section-title" style={ResumeStyleCStyle.h2}>Projects</h2>
            {resumeData.projects?.map((project, index) => (
                <div key={index} className="cv-entry" style={ResumeStyleCStyle.entry}>
                    <div style={ResumeStyleCStyle.entryHead}>
                        <h4 style={ResumeStyleCStyle.h4}>
                            {project.link ? (
                                <a href={project.link} target="_blank" rel="noopener noreferrer">{project.projectName}</a>
                            ) : (
                                project.projectName
                            )}
                            {project.role && (
                                <span style={{...ResumeStyleCStyle.mutedText, fontWeight: 400}}> · {project.role}</span>
                            )}
                        </h4>
                        <span style={ResumeStyleCStyle.period}>{formatPeriod(project)}</span>
                    </div>
                    {project.description && <p style={ResumeStyleCStyle.text}>{project.description}</p>}
                    {project.projectDetails.length > 0 && (
                        <ul className="cv-bullets" style={ResumeStyleCStyle.bullets}>
                            {project.projectDetails.map((detail, detailIndex) => (
                                <li key={detailIndex} style={ResumeStyleCStyle.bullet}>{detail}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </section>
    );

};
