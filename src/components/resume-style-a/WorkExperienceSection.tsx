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
                    <h2>Work Experience</h2>
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
                        <h4>{experience.jobTitle}</h4>
                        <ul>
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

WorkExperienceSection.propTypes = {

}