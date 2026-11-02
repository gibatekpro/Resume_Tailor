import React from "react";
import '../../styles/resumeBase.css';
import '../../styles/resumeStyleA.css';
import {HeaderSection} from "./HeaderSection";
import {SummarySection} from "./SummarySection";
import {ContactInfoSection} from "./ContactInfoSection";
import {SkillsSection} from "./SkillsSection";
import {WorkExperienceSection} from "./WorkExperienceSection";
import {EducationSection} from "./EducationSection";
import {ProjectsSection} from "./ProjectsSection";
import type { ResumeInfo } from "../../models/ResumeInfo";
import {cleanResume} from "../../utils/resumeFormat";


export const ResumeStyleA: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) =>{
    const resume = cleanResume(resumeData);

    return(
        <div className="cv-page cv-a">
            <HeaderSection resumeData={resume}/>
            <ContactInfoSection resumeData={resume}/>
            <SummarySection resumeData={resume}/>
            {resume.skills!.length > 0 && <SkillsSection resumeData={resume}/>}
            {resume.workExperience!.length > 0 && <WorkExperienceSection resumeData={resume}/>}
            {resume.projects!.length > 0 && <ProjectsSection resumeData={resume}/>}
            {resume.education!.length > 0 && <EducationSection resumeData={resume}/>}
        </div>
    );
}
