import React from "react";
import {useResumeProvider} from "../../context/ResumeContext";
import '../../styles/resumeStyleA.css';

export const SummarySection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();
    return(
        <div className={"summary-container"}>
            <p>
                {resumeData.profile.summary}
            </p>
        </div>
    );

}