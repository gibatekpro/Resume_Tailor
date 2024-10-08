import React, {useEffect} from 'react';
import '../../styles/resumeStyleB.css';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";

export const SkillsSection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();
    useEffect(()=>{

    },[resumeData]);

    return (
        <div>
            <h2>
                Skills
            </h2>
            {resumeData?.skills.map((skill, index) => (
                <p key={index}>{skill}</p>

            ))}
        </div>
    );
};

