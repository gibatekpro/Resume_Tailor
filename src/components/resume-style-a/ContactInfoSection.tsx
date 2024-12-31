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
                                                      rel="noopener noreferrer"><text style={{
                            fontWeight: "bold",
                        }}>{info.infoTitle}: </text> 
                            {info.infoLink}</a>
                    </span>
                    ) : (
                        <span key={index}>
                            {index !== 0 ? " | " : ""} <text style={{
                                fontWeight: "bold",
                        }}>{info.infoTitle}: </text> {info.infoDetails}
                    </span>
                    )
                ))}
            </p>
        </div>
    );
};

