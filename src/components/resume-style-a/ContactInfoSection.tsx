import React from 'react';
import {useResumeProvider} from "../../context/ResumeContext";
import '../../styles/resumeStyleA.css';
import {ResumeInfo} from "../../models/ResumeInfo";

export const ContactInfoSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {

    return (
        <div className="contactInfo-container">
            <p>
                {resumeData.contactInfo?.map((info, index) => (
                    info.infoLink ? (
                        <span key={index}>
                            {/* eslint-disable-next-line eqeqeq */}
                        {index !== 0 ? " | " : ""} <a href={info.infoLink} target="_blank"
                                             rel="noopener noreferrer">{info.infoTitle}</a>
                    </span>
                    ) : (
                        <span key={index}>
                        {index !== 0 ? " | " : ""} {info.infoTitle}: {info.infoDetails}
                    </span>
                    )
                ))}
            </p>
        </div>
    );
};

