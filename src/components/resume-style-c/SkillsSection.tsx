import React, {useEffect} from "react";
import {ResumeInfo} from "../../models/ResumeInfo";
import {Row} from "react-bootstrap";
import {CustomCol} from "../../custom_tags/CustomCol";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";

export const SkillsSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    const skillsTextDecoration = {
        borderBottom: '2px solid #b8adfb',
        marginRight: '20px', // Maintain original spacing
        padding: '0px 0', // Optional padding for better spacing
        whiteSpace: 'nowrap', // Prevent line breaks within each skill
    };

    useEffect(() => {}, [resumeData]);

    return (
        <div>
            <h2 style={{
                ...ResumeStyleCStyle.h2,
                ...ResumeStyleCStyle.boldText,
                ...ResumeStyleCStyle.initialCaps
            }}>Core Skills</h2>
            {resumeData?.skills?.map((skill, index) => (
                <span
                    key={index}
                    style={{
                        ...ResumeStyleCStyle.text,
                        ...ResumeStyleCStyle.semiBoldText
                    }}
                >
                {skill}
                    {index === resumeData?.skills!.length - 1 ? (
                        <span style={{ marginRight: '5px' }}> </span>
                    ) : (
                        <>, <span style={{ marginRight: '5px' }}> </span></>
                    )}
            </span>
            ))}
        </div>
    );

};
