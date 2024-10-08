
import React, {useEffect} from 'react';
import '../../styles/resumeStyleB.css';
import {useResumeProvider} from "../../context/ResumeContext";
import {CustomCol} from "../../custom_tags/CustomCol";
import avatarImage from  "../../assets/images/avatar_image.jpeg"

export const AvatarSection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();
    useEffect(()=>{

    },[resumeData]);

    return (
        <div className={"avatar-container"}>
            <div className="avatar">
                <img src={avatarImage} alt="AvatarSection"/>
            </div>
        </div>
    );
};

