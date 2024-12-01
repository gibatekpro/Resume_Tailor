import React, {useEffect} from 'react';
import '../../styles/resumeStyleB.css';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";
import {ResumeInfo} from "../../models/ResumeInfo";

export const SkillsSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    useEffect(()=>{

    },[resumeData]);

    return (
        <div>
            <h2>
                Skills
            </h2>
            {resumeData?.skills?.map((skill, index) => (
                <p key={index}>{skill}</p>

            ))}
        </div>
    );
};

