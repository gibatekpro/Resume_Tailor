import React from 'react';
import { Row } from 'react-bootstrap';
import {CustomCol} from "../../custom_tags/CustomCol";
import '../../styles/resumeStyleA.css';
import type { ResumeInfo } from "../../models/ResumeInfo";

export const ProjectsSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {

    return (
        <div>
            <Row className={"main-row"} style={{
                // ...DESIGN_BORDER
            }}>
                <CustomCol isLeft={true}>
                    {/* Content for the first column */}
                    <h2>Projects</h2>
                </CustomCol>
                <CustomCol isLeft={false}>

                </CustomCol>
            </Row>
            {resumeData.projects?.map((project, index) => (
                <Row key={index} className={"sub-row"} style={{
                    // ...DESIGN_BORDER
                }}>
                    <CustomCol isLeft={true}>
                        <h3>
                            {project.link ? (
                                <a href={project.link} target="_blank" rel="noopener noreferrer">
                                    {project.projectName}
                                </a>
                            ) : (
                                project.projectName
                            )}
                        </h3>
                        <span>{project.startMonth + project.startYear} - {project.endMonth + project.endYear}</span>
                    </CustomCol>
                    <CustomCol isLeft={false}>
                        <span  style={{
                            fontWeight: 'bold'
                        }}>{project.role}</span>
                        <ul className="list-disc pl-5 mb-0">
                            {project.projectDetails.map((detail, detailIndex) => (
                                <li key={detailIndex}>{detail}</li>
                            ))}
                        </ul>
                    </CustomCol>
                </Row>
            ))}
        </div>

    );
};
