import React, {useEffect} from 'react';
import { Row } from 'react-bootstrap';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";
import '../../styles/resumeStyleA.css';
import {ResumeInfo} from "../../models/ResumeInfo";


export const WorkExperienceSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {

    useEffect(()=>{

    },[resumeData]);


    return (
        <div>
            <Row className={"main-row"} style={{
                // ...DESIGN_BORDER
            }}>
                <CustomCol isLeft={true}>
                    {/* Content for the first column */}
                    <h2 style={{
                        marginBottom: '2px'
                    }}>Work Experience</h2>
                </CustomCol>
                <CustomCol isLeft={false}>

                </CustomCol>
            </Row>
            {resumeData.workExperience?.map((experience, index) => (
                <Row key={index} className={"sub-row"} style={{
                    // ...DESIGN_BORDER
                }}>
                    <CustomCol isLeft={true}>
                        <h3>{experience.companyName}</h3>
                        <text>{experience.startMonth + experience.startYear} - {experience.endMonth + experience.endYear}</text>
                    </CustomCol>
                    <CustomCol isLeft={false}>
                        <text  style={{
                            fontWeight: 'bold'
                        }}>{experience.jobTitle}</text>
                        <ul className="list-disc pl-5 mb-0">
                            {experience.duties.map((role, roleIndex) => (
                                <li key={roleIndex}>{role}</li>
                            ))}
                        </ul>
                    </CustomCol>
                </Row>
            ))}
        </div>

    );
};

WorkExperienceSection.propTypes = {}