import React from 'react';
import {Row, Col} from 'react-bootstrap';
import {useResumeProvider} from "../../context/ResumeContext";

export const EducationSection: React.FC = () => {
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
                    <h2>Education</h2>
                </Col>
                <Col lg={9} md={8} sm={12} className={"right-col"}>

                </Col>
            </Row>
            {resumeData.education.map((education, index) => (
                <Row key={index} className={"sub-row"} style={{
                    // ...designBorder
                }}>
                    <Col lg={3} md={4} sm={12} className={"left-col"}>
                        <h3>
                            {education.link ? (
                                <a href={education.link} target="_blank" rel="noopener noreferrer">
                                    {education.institutionName}
                                </a>
                            ) : (
                                education.institutionName
                            )}
                        </h3>
                        <text>{education.startDate} - {education.endDate}</text>
                    </Col>
                    <Col lg={9} md={8} sm={12} className={"right-col"}>
                        <h4>{education.degree} - {education.course}</h4>
                    </Col>
                </Row>
            ))}
        </div>

    );
};
