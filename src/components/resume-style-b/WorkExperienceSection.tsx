import React, {useEffect} from 'react';
import {Col, Row} from 'react-bootstrap';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";
import {ResumeInfo} from "../../models/ResumeInfo";


export const WorkExperienceSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {

    useEffect(()=>{

    },[resumeData]);


    return (
        <div className={"mt-4"}>
            <h3>Work Experience</h3>
            {resumeData.workExperience?.map((experience, index) => (
                <div key={index}>
                    <Row className={"sub-row"} key={index}>
                        <Col className={"left-sub-col"} xs={6} sm={6} md={6} lg={6}>
                            <h4>{experience.jobTitle}</h4>
                        </Col>
                        <Col className={"right-col"} xs={6} sm={6} md={6} lg={6}>
                            <h4>
                                {experience.startMonth + " " + experience.startYear} - {experience.endMonth + " " + experience.endYear}
                            </h4>
                        </Col>
                    </Row>
                    <div className={"sub-row mb-2"}>
                        <div className={"left-sub-col"}>
                            <h4>@: {experience.companyName}</h4>
                        </div>
                    </div>
                    {/* Add bullet points explicitly */}
                    <ul className="list-disc pl-5 mb-3">
                        {experience.duties.map((role, roleIndex) => (
                            <li key={roleIndex}>{role}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );

};
