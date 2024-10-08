import React, {useEffect} from 'react';
import {Col, Row} from 'react-bootstrap';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";


export const ProjectsSection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();

    useEffect(()=>{

    },[resumeData]);


    return (
        <div>
            <h3>Projects</h3>
            {resumeData.projects.map((project, index) => (
                <div key={index}>
                    <Row className={"sub-row"} key={index}>
                        <Col className={"left-sub-col"} xs={6} sm={6} md={6} lg={6}>
                            <h4>{project.projectName}</h4>
                        </Col>
                        <Col className={"right-col"} xs={6} sm={6} md={6} lg={6}>
                            <h4>{project.startDate} - {project.endDate}</h4>
                        </Col>
                    </Row>
                    {/*<div className={"sub-row"}>*/}
                    {/*    <div className={"left-col"}>*/}
                    {/*        <h4>{project.role}</h4>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <ul>
                        {project.projectDetails.map((detail, roleIndex) => (
                            <li key={roleIndex}>{detail}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

    );
};
