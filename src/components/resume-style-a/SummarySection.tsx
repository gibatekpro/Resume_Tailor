import React from "react";
import type { ResumeInfo } from "../../models/ResumeInfo";

export const SummarySection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    if (!resumeData.profile?.summary) {
        return null;
    }

    return <p className="cv-a-summary">{resumeData.profile.summary}</p>;
}
