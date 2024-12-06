import React from 'react';
import {Row} from 'react-bootstrap';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";
import '../../styles/resumeStyleA.css';
import {ResumeInfo} from "../../models/ResumeInfo";

export const EducationSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {

    return (
        <div>
            <Row className={"main-row"} style={{
                // ...DESIGN_BORDER
            }}>
                <CustomCol isLeft={true}>
                    {/* Content for the first column */}
                    <h2>Education</h2>
                </CustomCol>
                <CustomCol isLeft={false}>

                </CustomCol>
            </Row>
            {resumeData.education?.map((education, index) => (
                <Row key={index} className={"sub-row"} style={{
                    // ...DESIGN_BORDER
                }}>
                    <CustomCol isLeft={true}>
                        <h3>
                            {education.link ? (
                                <a href={education.link} target="_blank" rel="noopener noreferrer">
                                    {education.institutionName}
                                </a>
                            ) : (
                                education.institutionName
                            )}
                        </h3>
                        <text>{education.startMonth + education.startYear} - {education.endMonth + education.endYear}</text>
                    </CustomCol>
                    <CustomCol isLeft={false}>
                        <h4>{education.degree} - {education.course}</h4>
                    </CustomCol>
                </Row>
            ))}
        </div>

    );
};
