import React from "react";
import type { ResumeInfo } from "../../models/ResumeInfo";
 
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";

export const SkillsSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    

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
