import React from "react";
import '../../styles/resumeBase.css';
import type { ResumeInfo } from "../../models/ResumeInfo";
import {HeaderSection} from "./HeaderSection";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";
import {ContactInfoSection} from "./ContactInfoSection";
import {WorkExperienceSection} from "./WorkExperienceSection";
import {SummarySection} from "./SummarySection";
import {ProjectsSection} from "./ProjectsSection";
import {SkillsSection} from "./SkillsSection";
import {EducationSection} from "./EducationSection";
import {LanguageSection} from "./LanguageSection";
import {cleanResume} from "../../utils/resumeFormat";


export const ResumeStyleC: React.FunctionComponent<{resumeData: ResumeInfo}> = ({resumeData}) => {
    const resume = cleanResume(resumeData);

    return(
        <div className="cv-page cv-c" style={ResumeStyleCStyle.mainContainer}>
            <div style={ResumeStyleCStyle.header}>
                <HeaderSection resumeData={resume}/>
                <ContactInfoSection resumeData={resume}/>
            </div>
            <SummarySection resumeData={resume}/>
            {resume.skills!.length > 0 && <SkillsSection resumeData={resume}/>}
            {resume.workExperience!.length > 0 && <WorkExperienceSection resumeData={resume}/>}
            {resume.projects!.length > 0 && <ProjectsSection resumeData={resume}/>}
            {resume.education!.length > 0 && <EducationSection resumeData={resume}/>}
            {resume.languages!.length > 0 && <LanguageSection resumeData={resume}/>}
        </div>
    )
}
