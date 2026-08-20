import React, {useEffect} from 'react';
import { Row } from 'react-bootstrap';
import {CustomCol} from "../../custom_tags/CustomCol";
import '../../styles/resumeStyleA.css';
import type { ResumeInfo } from "../../models/ResumeInfo";


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
                        <span>{experience.startMonth + experience.startYear} - {experience.endMonth + experience.endYear}</span>
                    </CustomCol>
                    <CustomCol isLeft={false}>
                        <span  style={{
                            fontWeight: 'bold'
                        }}>{experience.jobTitle}</span>
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