import React from "react";
import '../../styles/resumeStyleB.css';
import {useResumeProvider} from "../../context/ResumeContext";
import {ResumeInfo} from "../../models/ResumeInfo";

export const SummarySection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return(
        <div>
            <h3>Summary</h3>
            <p>
                {resumeData.profile?.summary}
            </p>
        </div>
    );

}