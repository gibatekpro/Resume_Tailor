import React, {useEffect} from 'react';
import {Col, Row} from 'react-bootstrap';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";


export const WorkExperienceSection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();

    useEffect(()=>{

    },[resumeData]);


    return (
        <div>
            <h3>Work Experience</h3>
            {resumeData.workExperience.map((experience, index) => (
                <div key={index}>
                    <Row className={"sub-row"} key={index}>
                        <Col className={"left-col"} xs={6} sm={6} md={6} lg={6}>
                            <h4>{experience.jobTitle}</h4>
                        </Col>
                        <Col className={"right-col"} xs={6} sm={6} md={6} lg={6}>
                            <h4>{experience.startDate} - {experience.endDate}</h4>
                        </Col>
                    </Row>
                    <div className={"sub-row"}>
                        <div className={"left-col"}>
                            <h4>@: {experience.companyName}</h4>
                        </div>
                    </div>
                    <ul>
                    {experience.roles.map((role, roleIndex) => (
                            <li key={roleIndex}>{role}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

    );
};
