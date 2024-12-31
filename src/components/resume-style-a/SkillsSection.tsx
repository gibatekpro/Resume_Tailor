import React, {useEffect} from 'react';
import { Row} from 'react-bootstrap';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";
import '../../styles/resumeStyleA.css';
import {ResumeInfo} from "../../models/ResumeInfo";

export const SkillsSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    const skillsTextDecoration = {
        borderBottom: '2px solid #b8adfb',
        marginRight: '20px', // Maintain original spacing
        padding: '0px 0', // Optional padding for better spacing
        whiteSpace: 'nowrap', // Prevent line breaks within each skill
    };

    useEffect(() => {}, [resumeData]);

    return (
        <Row className="main-row">
            <CustomCol isLeft={true}>
                {/* Content for the first CustomColumn */}
                <h2>Skills</h2>
            </CustomCol>
            <CustomCol isLeft={false}>
                {/* Container for skills */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap', // Allow wrapping to the next line
                        gap: '0px', // No additional gap, maintain marginRight instead
                        maxWidth: '100%', // Ensure container fits within the layout
                    }}
                >
                    {/* Map through the skills array to render each skill */}
                    {resumeData.skills?.map((skill, index) => (
                        <span key={index} style={skillsTextDecoration}>
                            {skill}
                        </span>
                    ))}
                </div>
            </CustomCol>
        </Row>
    );
};
