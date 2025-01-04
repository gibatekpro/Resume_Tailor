import React, {useEffect} from "react";
import {ResumeInfo} from "../../models/ResumeInfo";
import {Col, Row} from "react-bootstrap";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";


export const ProjectsSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {

    useEffect(()=>{

    },[resumeData]);


    return (
        <div>
            <h2 style={{
                ...ResumeStyleCStyle.h2,
                ...ResumeStyleCStyle.boldText,
                ...ResumeStyleCStyle.initialCaps
            }}>Projects</h2>
            <div style={{
                ...ResumeStyleCStyle.mediumSpacing
            }}></div>
            {resumeData.projects?.map((project, index) => (
                <div key={index}>
                    <Row key={index}>
                        <Col xs={6} sm={6} md={6} lg={6} style={ResumeStyleCStyle.leftCol}>
                            <h4 style={{
                                ...ResumeStyleCStyle.h4,
                                ...ResumeStyleCStyle.initialCaps,
                                ...ResumeStyleCStyle.semiBoldText
                            }}>{project.projectName}</h4>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} style={ResumeStyleCStyle.rightCol}>
                            <p style={{
                                ...ResumeStyleCStyle.text,
                                ...ResumeStyleCStyle.semiBoldText
                            }}>
                                {project.startMonth + " " + project.startYear} - {project.endMonth + " " + project.endYear}
                            </p>
                        </Col>
                    </Row>
                    <div style={{
                        ...ResumeStyleCStyle.mediumSpacing
                    }}></div>
                    <ul className="list-disc pl-5 mb-3">
                        {project.projectDetails.map((detail, roleIndex) => (
                            <li key={roleIndex} style={{
                                ...ResumeStyleCStyle.text,
                                ...ResumeStyleCStyle.semiBoldText
                            }}>{detail}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );

};
