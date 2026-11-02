import React from "react";
import type { ResumeInfo } from "../../models/ResumeInfo";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";

export const SkillsSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return (
        <section style={{...ResumeStyleCStyle.section, ...ResumeStyleCStyle.entry}}>
            <h2 className="cv-section-title" style={ResumeStyleCStyle.h2}>Core Skills</h2>
            <p style={ResumeStyleCStyle.text}>
                {resumeData.skills?.map((skill, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && " · "}
                        <span style={{whiteSpace: 'nowrap'}}>{skill}</span>
                    </React.Fragment>
                ))}
            </p>
        </section>
    );

};
