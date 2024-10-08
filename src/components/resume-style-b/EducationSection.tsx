import React, {useEffect} from 'react';
import {Col, Row} from 'react-bootstrap';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";
import {DESIGN_BORDER} from "../../constants/DesignConstants";


export const EducationSection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();

    useEffect(()=>{

    },[resumeData]);


    return (
        <div>
            <h3>Education</h3>
            {resumeData.education.map((education, index) => (
                <div key={index}>
                    <Row className={"sub-row"} key={index} >
                        <Col className={"left-col"} xs={6} sm={6} md={6} lg={6}>
                            <h4>{education.link ? (
                                <a href={education.link} target="_blank" rel="noopener noreferrer">
                                    {education.institutionName}
                                </a>
                            ) : (
                                education.institutionName
                            )}
                            </h4>
                        </Col>
                        <Col className={"right-col"} xs={6} sm={6} md={6} lg={6}>
                            <h4>{education.startDate} - {education.endDate}</h4>
                        </Col>
                    </Row>
                    <p>{education.degree} - {education.course}</p>
                </div>
            ))}
        </div>

    );
};