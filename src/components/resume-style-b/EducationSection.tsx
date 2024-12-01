import React, {useEffect} from 'react';
import {Col, Row} from 'react-bootstrap';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";
import {DESIGN_BORDER} from "../../constants/DesignConstants";
import {ResumeInfo} from "../../models/ResumeInfo";


export const EducationSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {

    useEffect(()=>{

    },[resumeData]);


    return (
        <div>
            <h3>Education</h3>
            {resumeData.education?.map((education, index) => (
                <div key={index}>
                    <Row className={"sub-row"} key={index} >
                        <Col className={"left-sub-col"} xs={6} sm={6} md={6} lg={6}>
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
                            <h4>{education.startMonth + " " + education.startYear} - {education.endMonth + " " + education.endYear}</h4>
                        </Col>
                    </Row>
                    <p className={"mb-3"}>{education.degree} - {education.course}</p>
                </div>
            ))}
        </div>

    );
};