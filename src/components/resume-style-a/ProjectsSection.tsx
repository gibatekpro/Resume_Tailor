import React from 'react';
import { Row, Col } from 'react-bootstrap';
import {useResumeProvider} from "../../context/ResumeContext";

export const ProjectsSection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();
    const designBorder = {
        border: '1px solid black',
    };

    return (
        <div>
            <Row className={"main-row"} style={{
                // ...designBorder
            }}>
                <Col lg={3} md={4} sm={12} className={"left-col"}>
                    {/* Content for the first column */}
                    <h2>Projects</h2>
                </Col>
                <Col lg={9} md={8} sm={12} className={"right-col"}>

                </Col>
            </Row>
            {resumeData.projects.map((project, index) => (
                <Row key={index} className={"sub-row"} style={{
                    // ...designBorder
                }}>
                    <Col lg={3} md={4} sm={12} className={"left-col"}>
                        <h3>
                            {project.link ? (
                                <a href={project.link} target="_blank" rel="noopener noreferrer">
                                    {project.projectName}
                                </a>
                            ) : (
                                project.projectName
                            )}
                        </h3>
                        <text>{project.startDate} - {project.endDate}</text>
                    </Col>
                    <Col lg={9} md={8} sm={12} className={"right-col"}>
                        <h4>{project.role}</h4>
                        <ul>
                            {project.projectDetails.map((detail, detailIndex) => (
                                <li key={detailIndex}>{detail}</li>
                            ))}
                        </ul>
                    </Col>
                </Row>
            ))}
        </div>

    );
};
