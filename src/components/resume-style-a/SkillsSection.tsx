import React, {useEffect} from 'react';
import { Row} from 'react-bootstrap';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";
import '../../styles/resumeStyleA.css';
import {ResumeInfo} from "../../models/ResumeInfo";

export const SkillsSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    const skillsTextDecoration = {
        borderBottom: '2px solid #b8adfb',
        marginRight: '20px'
    };

    useEffect(()=>{

    },[resumeData]);

    return (
        <Row>
            <CustomCol isLeft={true}>
                {/* Content for the first CustomColumn */}
                <h2>Skills</h2>
            </CustomCol>
            <CustomCol isLeft={false}>
                {/* Map through the skills array to render each skill */}
                {resumeData.skills?.map((skill, index) => (
                    <text key={index} style={{...skillsTextDecoration}}>{skill}</text>

                ))}
            </CustomCol>
        </Row>
    );
};

