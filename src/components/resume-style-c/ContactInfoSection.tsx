import React from "react";
import {ResumeInfo} from "../../models/ResumeInfo";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";

export const ContactInfoSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {

    return (
        <div>
            {resumeData.contactInfo?.map((info, index) => (
                info.infoLink ? (
                    <p key={index} style={ResumeStyleCStyle.contactInfoP}>
                        <a
                            href={info.infoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={ResumeStyleCStyle.contactInfoA}
                        >
                            {info.infoLink}
                        </a>
                    </p>
                ) : (
                    <p key={index}  style={ResumeStyleCStyle.contactInfoP}>
                        {info.infoDetails}
                    </p>
                )
            ))}
        </div>
    );

};