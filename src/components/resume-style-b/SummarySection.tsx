import React from "react";
import type { ResumeInfo } from "../../models/ResumeInfo";

export const SummarySection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    if (!resumeData.profile?.summary) {
        return null;
    }

    return (
        <section className="cv-b-section cv-entry">
            <h2 className="cv-section-title">Summary</h2>
            <p>{resumeData.profile.summary}</p>
        </section>
    );
}
