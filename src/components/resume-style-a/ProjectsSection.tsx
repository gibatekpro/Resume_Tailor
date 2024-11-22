import React from 'react';
import { Row } from 'react-bootstrap';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";
import '../../styles/resumeStyleA.css';

export const ProjectsSection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();

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
                        <text>{project.startMonth + project.startYear} - {project.endMonth + project.endYear}</text>
                    </CustomCol>
                    <CustomCol isLeft={false}>
                        <h4>{project.role}</h4>
                        <ul>
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
