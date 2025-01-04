import React, {useEffect} from "react";
import {ResumeInfo} from "../../models/ResumeInfo";
import {Col, Row} from "react-bootstrap";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";


export const WorkExperienceSection: React.FC<{ resumeData: ResumeInfo }> = ({resumeData}) => {

    useEffect(() => {

    }, [resumeData]);


    return (
        <div>
            <h2 style={{
                ...ResumeStyleCStyle.h2,
                ...ResumeStyleCStyle.boldText,
                ...ResumeStyleCStyle.initialCaps
            }}>Work Experience</h2>
            <div style={{
                ...ResumeStyleCStyle.mediumSpacing
            }}></div>
            {resumeData.workExperience?.map((experience, index) => (
                <div key={index}>
                    <Row key={index}>
                        <Col xs={6} sm={6} md={6} lg={6} style={ResumeStyleCStyle.leftCol}>
                            <h4 style={{
                                ...ResumeStyleCStyle.h4,
                                ...ResumeStyleCStyle.initialCaps,
                                ...ResumeStyleCStyle.semiBoldText
                            }}>{experience.jobTitle}</h4>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} style={ResumeStyleCStyle.rightCol}>
                            <p style={{
                                ...ResumeStyleCStyle.text,
                                ...ResumeStyleCStyle.semiBoldText
                            }}>
                                {experience.startMonth + " " + experience.startYear} - {experience.endMonth + " " + experience.endYear}
                            </p>
                        </Col>
                    </Row>
                    <div>
                        <div>
                            <p style={{
                                ...ResumeStyleCStyle.contactInfoP
                            }}>@: {experience.companyName}</p>
                        </div>
                    </div>
                    <div style={{
                        ...ResumeStyleCStyle.mediumSpacing
                    }}></div>
                    <ul className="list-disc pl-5 mb-3">
                        {experience.duties.map((duty, roleIndex) => (
                            <li key={roleIndex} style={{
                                ...ResumeStyleCStyle.text,
                                ...ResumeStyleCStyle.semiBoldText
                            }}>{duty}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );

};
