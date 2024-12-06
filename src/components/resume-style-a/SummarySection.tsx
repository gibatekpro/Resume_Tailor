import React from "react";
import {useResumeProvider} from "../../context/ResumeContext";
import '../../styles/resumeStyleA.css';
import {ResumeInfo} from "../../models/ResumeInfo";

export const SummarySection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return(
        <div className={"summary-container"}>
            <p>
                {resumeData.profile?.summary}
            </p>
        </div>
    );

}