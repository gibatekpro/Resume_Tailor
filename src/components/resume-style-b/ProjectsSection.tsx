import React from 'react';
import type { ResumeInfo } from "../../models/ResumeInfo";
import {formatPeriod} from "../../utils/resumeFormat";

export const ProjectsSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return (
        <section className="cv-b-section">
            <h2 className="cv-section-title">Projects</h2>
            {resumeData.projects?.map((project, index) => (
                <div key={index} className="cv-b-entry cv-entry">
                    <div className="cv-b-entry-head">
                        <h3>
                            {project.link ? (
                                <a href={project.link} target="_blank" rel="noopener noreferrer">{project.projectName}</a>
                            ) : (
                                project.projectName
                            )}
                        </h3>
                        <span className="cv-b-period">{formatPeriod(project)}</span>
                    </div>
                    {project.role && <p className="cv-b-subtitle">{project.role}</p>}
                    {project.description && <p>{project.description}</p>}
                    {project.projectDetails.length > 0 && (
                        <ul className="cv-bullets">
                            {project.projectDetails.map((detail, detailIndex) => (
                                <li key={detailIndex}>{detail}</li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </section>
    );
};
