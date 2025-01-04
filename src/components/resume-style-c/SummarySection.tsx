import React from "react";
import {ResumeInfo} from "../../models/ResumeInfo";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";

export const SummarySection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return(
        <div>
            {/*<h3>Summary</h3>*/}
            <p style={{
                ...ResumeStyleCStyle.text,
                ...ResumeStyleCStyle.semiBoldText
            }}>
                {resumeData.profile?.summary}
            </p>
        </div>
    );

}