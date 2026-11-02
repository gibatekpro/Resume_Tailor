import React from "react";
import type { ResumeInfo } from "../../models/ResumeInfo";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";

export const SummarySection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    if (!resumeData.profile?.summary) {
        return null;
    }

    return(
        <p style={{...ResumeStyleCStyle.text, ...ResumeStyleCStyle.section}}>
            {resumeData.profile.summary}
        </p>
    );

}
