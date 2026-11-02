import React from "react";
import type { ResumeInfo } from "../../models/ResumeInfo";
import {initials} from "../../utils/resumeFormat";

// A monogram of the candidate's own initials, rather than a photo (UK CVs normally leave photos out).
export const AvatarSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    const monogram = initials(resumeData);
    if (!monogram) {
        return null;
    }

    return <div className="cv-b-monogram" aria-hidden="true">{monogram}</div>;
};
