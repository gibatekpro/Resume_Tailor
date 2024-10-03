import React from 'react';
import {useResumeProvider} from "../../context/ResumeContext";

export const ContactInfoSection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();

    return (
        <div className="contactInfo-container">
            <p>
                {resumeData.contactInfo.map((info, index) => (
                    info.infoLink ? (
                        <span key={index}>
                            {/* eslint-disable-next-line eqeqeq */}
                        {index !== 0 ? " | " : ""} {info.infoTitle}: <a href={info.infoLink} target="_blank"
                                             rel="noopener noreferrer">{info.linkTag}</a>
                    </span>
                    ) : (
                        <span key={index}>
                        {index !== 0 ? " | " : ""} {info.infoTitle}
                    </span>
                    )
                ))}
            </p>
        </div>
    );
};