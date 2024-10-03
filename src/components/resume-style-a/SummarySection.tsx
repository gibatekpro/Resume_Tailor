import React from "react";
import {useResumeProvider} from "../../context/ResumeContext";

export const SummarySection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();
    return(
        <div className={"summary-container"}>
            <p>
                {resumeData.summary}
            </p>
        </div>
    );

}