import React, {useEffect} from 'react';
import {Col, Row} from 'react-bootstrap';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";
import {ResumeInfo} from "../../models/ResumeInfo";


export const ProjectsSection: React.FC<{resumeDataOpenAI: ResumeInfo}> = ({resumeDataOpenAI}) => {

    useEffect(()=>{

    },[resumeDataOpenAI]);


    return (
        <div>
            <h3>Projects</h3>
            {resumeDataOpenAI.projects?.map((project, index) => (
                <div key={index}>
                    <Row className={"sub-row"} key={index}>
                        <Col className={"left-sub-col"} xs={6} sm={6} md={6} lg={6}>
                            <h4>{project.projectName}</h4>
                        </Col>
                        <Col className={"right-col"} xs={6} sm={6} md={6} lg={6}>
                            <h4>
                                {project.startMonth + " " + project.startYear} - {project.endMonth + " " + project.endYear}
                            </h4>
                        </Col>
                    </Row>
                    {/* Add bullet points explicitly */}
                    <ul className="list-disc pl-5 mb-3">
                        {project.projectDetails.map((detail, roleIndex) => (
                            <li key={roleIndex}>{detail}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );

};
