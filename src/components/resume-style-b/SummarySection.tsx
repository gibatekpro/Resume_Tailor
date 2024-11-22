import React from "react";
import '../../styles/resumeStyleB.css';
import {useResumeProvider} from "../../context/ResumeContext";

export const SummarySection: React.FC = () => {
    const {resumeData, setResumeData} = useResumeProvider();
    return(
        <div>
            <h3>Summary</h3>
            <p>
                {resumeData.profile.summary}
            </p>
        </div>
    );

}