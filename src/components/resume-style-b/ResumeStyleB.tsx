import React from "react";
import '../../styles/resumeBase.css';
import '../../styles/resumeStyleB.css';
import {SkillsSection} from "./SkillsSection";
import {ContactInfoSection} from "./ContactInfoSection";
import {HeaderSection} from "./HeaderSection";
import {SummarySection} from "./SummarySection";
import {WorkExperienceSection} from "./WorkExperienceSection";
import {EducationSection} from "./EducationSection";
import {ProjectsSection} from "./ProjectsSection";
import {AvatarSection} from "./AvatarSection";
import {LanguageSection} from "./LanguageSection";
import type { ResumeInfo } from "../../models/ResumeInfo";
import {cleanResume} from "../../utils/resumeFormat";


export const ResumeStyleB: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) =>{
    const resume = cleanResume(resumeData);

    return(
        <div className="cv-page cv-b">
            <aside className="cv-b-side">
                <AvatarSection resumeData={resume}/>
                {resume.contactInfo!.length > 0 && <ContactInfoSection resumeData={resume}/>}
                {resume.skills!.length > 0 && <SkillsSection resumeData={resume}/>}
                {resume.languages!.length > 0 && <LanguageSection resumeData={resume}/>}
            </aside>
            <main className="cv-b-main">
                <HeaderSection resumeData={resume}/>
                <div className="cv-b-body">
                    <SummarySection resumeData={resume}/>
                    {resume.workExperience!.length > 0 && <WorkExperienceSection resumeData={resume}/>}
                    {resume.projects!.length > 0 && <ProjectsSection resumeData={resume}/>}
                    {resume.education!.length > 0 && <EducationSection resumeData={resume}/>}
                </div>
            </main>
        </div>
    );
}
