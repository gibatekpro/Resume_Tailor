import React, {useEffect} from "react";
import {ResumeInfo} from "../../models/ResumeInfo";
import {Col, Row} from "react-bootstrap";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";


export const EducationSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {

    useEffect(()=>{

    },[resumeData]);


    return (
        <div>
            <h2 style={{
                ...ResumeStyleCStyle.h2,
                ...ResumeStyleCStyle.boldText,
                ...ResumeStyleCStyle.initialCaps
            }}>Education</h2>
            <div style={{
                ...ResumeStyleCStyle.mediumSpacing
            }}></div>
            {resumeData.education?.map((education, index) => (
                <div key={index}>
                    <Row key={index}>
                        <Col xs={6} sm={6} md={6} lg={6} style={ResumeStyleCStyle.leftCol}>
                            <h4 style={{
                                ...ResumeStyleCStyle.h4,
                                ...ResumeStyleCStyle.initialCaps,
                                ...ResumeStyleCStyle.semiBoldText
                            }}>{education.link ? (
                                <a href={education.link} target="_blank" rel="noopener noreferrer">
                                    {education.institutionName}
                                </a>
                            ) : (
                                education.institutionName
                            )}
                            </h4>
                        </Col>
                        <Col className={"right-col"} xs={6} sm={6} md={6} lg={6} style={ResumeStyleCStyle.rightCol}>
                            <p style={{
                                ...ResumeStyleCStyle.text,
                                ...ResumeStyleCStyle.semiBoldText
                            }}>{education.startMonth + " " + education.startYear} - {education.endMonth + " " + education.endYear}</p>
                        </Col>
                    </Row>
                    <span style={{
                        ...ResumeStyleCStyle.text,
                        ...ResumeStyleCStyle.boldText,
                    }}>{education.degree}</span>
                    <span style={{
                        ...ResumeStyleCStyle.text,
                    }}> {education.course}</span>
                    <div style={{
                        ...ResumeStyleCStyle.mediumSpacing
                    }}></div>
                </div>
            ))}
        </div>

    );
};