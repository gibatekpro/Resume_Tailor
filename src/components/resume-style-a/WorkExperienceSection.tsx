import React, {useEffect} from 'react';
import { Row } from 'react-bootstrap';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";


export const WorkExperienceSection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();

    useEffect(()=>{

    },[resumeData]);


    return (
        <div>
            <Row className={"main-row"} style={{
                // ...DESIGN_BORDER
            }}>
                <CustomCol isLeft={true}>
                    {/* Content for the first column */}
                    <h2>Work Experience</h2>
                </CustomCol>
                <CustomCol isLeft={false}>

                </CustomCol>
            </Row>
            {resumeData.workExperience.map((experience, index) => (
                <Row key={index} className={"sub-row"} style={{
                    // ...DESIGN_BORDER
                }}>
                    <CustomCol isLeft={true}>
                        <h3>{experience.companyName}</h3>
                        <text>{experience.startDate} - {experience.endDate}</text>
                    </CustomCol>
                    <CustomCol isLeft={false}>
                        <h4>{experience.jobTitle}</h4>
                        <ul>
                            {experience.roles.map((role, roleIndex) => (
                                <li key={roleIndex}>{role}</li>
                            ))}
                        </ul>
                    </CustomCol>
                </Row>
            ))}
        </div>

    );
};
