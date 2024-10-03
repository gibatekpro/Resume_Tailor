import React, {useEffect} from 'react';
import { Row, Col } from 'react-bootstrap';
import {ResumeData} from "../../models/ResumeData";
import {useResumeProvider} from "../../context/ResumeContext";
import {resumeData} from "../../data/resumeData";

type SkillsSectionProps= {
    resumeData: ResumeData
}

export const SkillsSection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();
    const skillsTextDecoration = {
        borderBottom: '2px solid #b8adfb',
        marginRight: '20px'
    };

    useEffect(()=>{

    },[resumeData]);

    return (
        <Row className={"main-row"}>
            <Col lg={3} md={4} sm={12} className={"left-col"}>
                {/* Content for the first column */}
                <h2>Skills</h2>
            </Col>
            <Col lg={9} md={8} sm={12} className={"right-col"}>
                {/* Map through the skills array to render each skill */}
                {resumeData?.skills.map((skill, index) => (
                    <text key={index} style={{...skillsTextDecoration}}>{skill}</text>

                ))}
            </Col>
        </Row>
    );
};
