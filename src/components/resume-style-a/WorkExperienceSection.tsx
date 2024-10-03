import React, {useEffect} from 'react';
import { Row, Col } from 'react-bootstrap';
import {useResumeProvider} from "../../context/ResumeContext";


export const WorkExperienceSection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();
    const designBorder = {
        border: '1px solid black',
    };

    useEffect(()=>{

    },[resumeData]);


    return (
        <div>
            <Row className={"main-row"} style={{
                // ...designBorder
            }}>
                <Col lg={3} md={4} sm={12} className={"left-col"}>
                    {/* Content for the first column */}
                    <h2>Work Experience</h2>
                </Col>
                <Col lg={9} md={8} sm={12} className={"right-col"}>

                </Col>
            </Row>
            {resumeData.workExperience.map((experience, index) => (
                <Row key={index} className={"sub-row"} style={{
                    // ...designBorder
                }}>
                    <Col lg={3} md={4} sm={12} className={"left-col"}>
                        <h3>{experience.companyName}</h3>
                        <text>{experience.startDate} - {experience.endDate}</text>
                    </Col>
                    <Col lg={9} md={8} sm={12} className={"right-col"}>
                        <h4>{experience.jobTitle}</h4>
                        <ul>
                            {experience.roles.map((role, roleIndex) => (
                                <li key={roleIndex}>{role}</li>
                            ))}
                        </ul>
                    </Col>
                </Row>
            ))}
        </div>

    );
};
