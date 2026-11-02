import React from "react";
import type { ResumeInfo } from "../../models/ResumeInfo";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";
import {contactText} from "../../utils/resumeFormat";

export const ContactInfoSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {

    return (
        <div style={ResumeStyleCStyle.contactList}>
            {resumeData.contactInfo?.map((info, index) => (
                <p key={index} style={ResumeStyleCStyle.contactInfoP}>
                    {info.infoLink ? (
                        <a href={info.infoLink} target="_blank" rel="noopener noreferrer" style={ResumeStyleCStyle.contactInfoA}>
                            {contactText(info)}
                        </a>
                    ) : (
                        contactText(info)
                    )}
                </p>
            ))}
        </div>
    );

};
