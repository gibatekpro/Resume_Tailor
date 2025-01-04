import React, {useEffect} from "react";
import {ResumeInfo} from "../../models/ResumeInfo";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";


export const HeaderSection: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) => {

    useEffect(() => {
    }, [resumeData]);

    return (
        <header className={"none"} style={{}}>
            <h1 style={{
                ...ResumeStyleCStyle.h1,
                ...ResumeStyleCStyle.capitalizeText
            }}>{resumeData.profile?.firstName} {resumeData.profile?.lastName}</h1>
            <h3 style={{
                ...ResumeStyleCStyle.h3,
                ...ResumeStyleCStyle.initialCaps,
            }}>{resumeData.profile?.profession}</h3>
        </header>
    );
};