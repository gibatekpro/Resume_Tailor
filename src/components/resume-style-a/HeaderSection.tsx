import React from 'react';
import type { ResumeInfo } from "../../models/ResumeInfo";

export const HeaderSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return (
        <header className="cv-a-header">
            <h1>{resumeData.profile?.firstName} {resumeData.profile?.lastName}</h1>
            {resumeData.profile?.profession && (
                <p className="cv-a-profession">{resumeData.profile.profession}</p>
            )}
        </header>
    );
};
