import React from "react";
import '../../styles/resumeStyleB.css';
import {useResumeProvider} from "../../context/ResumeContext";
import {ResumeInfo} from "../../models/ResumeInfo";

export const SummarySection: React.FC<{resumeDataOpenAI: ResumeInfo}> = ({resumeDataOpenAI}) => {
    return(
        <div>
            <h3>Summary</h3>
            <p>
                {resumeDataOpenAI.profile?.summary}
            </p>
        </div>
    );

}