import React from 'react';
import type { ResumeInfo } from "../../models/ResumeInfo";
import {formatPeriod} from "../../utils/resumeFormat";

export const ProjectsSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return (
        <section className="cv-a-section">
            <h2 className="cv-section-title">Projects</h2>
            {resumeData.projects?.map((project, index) => (
                <div key={index} className="cv-a-row cv-entry">
                    <div>
                        <h3>
                            {project.link ? (
                                <a href={project.link} target="_blank" rel="noopener noreferrer">{project.projectName}</a>
                            ) : (
                                project.projectName
                            )}
                        </h3>
                        <p className="cv-a-period">{formatPeriod(project)}</p>
                    </div>
                    <div>
                        {project.role && <p className="cv-a-role">{project.role}</p>}
                        {project.description && <p>{project.description}</p>}
                        {project.projectDetails.length > 0 && (
                            <ul className="cv-bullets">
                                {project.projectDetails.map((detail, detailIndex) => (
                                    <li key={detailIndex}>{detail}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            ))}
        </section>
    );
};
