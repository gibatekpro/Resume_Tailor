import React from "react";
import type { ResumeInfo } from "../../models/ResumeInfo";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";


export const HeaderSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {
    return (
        <header>
            <h1 style={ResumeStyleCStyle.h1}>{resumeData.profile?.firstName} {resumeData.profile?.lastName}</h1>
            {resumeData.profile?.profession && (
                <h3 style={ResumeStyleCStyle.h3}>{resumeData.profile.profession}</h3>
            )}
        </header>
    );
};
