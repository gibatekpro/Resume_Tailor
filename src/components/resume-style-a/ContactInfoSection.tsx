import React from 'react';
import type { ResumeInfo } from "../../models/ResumeInfo";
import {contactText} from "../../utils/resumeFormat";

export const ContactInfoSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return (
        <p className="cv-a-contact">
            {resumeData.contactInfo?.map((info, index) => (
                <span key={index}>
                    {info.infoLink ? (
                        <a href={info.infoLink} target="_blank" rel="noopener noreferrer">{contactText(info)}</a>
                    ) : (
                        contactText(info)
                    )}
                </span>
            ))}
        </p>
    );
};
