import React, {useEffect, useState} from "react";
import '../../styles/resumeStyleA.css';
import {HeaderSection} from "./HeaderSection";
import {SummarySection} from "./SummarySection";
import {ContactInfoSection} from "./ContactInfoSection";
import {Container} from "react-bootstrap";
import {SkillsSection} from "./SkillsSection";
import {WorkExperienceSection} from "./WorkExperienceSection";
import {EducationSection} from "./EducationSection";
import {ProjectsSection} from "./ProjectsSection";
import {useResumeProvider} from "../../context/ResumeContext";
import {ResumeInfo} from "../../models/ResumeInfo";


export const ResumeStyleA: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) =>{

    const [hasProjects, setHasProjects] = useState(false);
    const [hasSkills, setHasSkills] = useState(false);
    const [hasWorkExperience, setHasWorkExperience] = useState(false);
    const [hasEducation, setHasEducation] = useState(false);

    useEffect(() => {
        // Update state for sections visibility
        setHasProjects(!!resumeData.projects && resumeData.projects.length > 0);
        setHasSkills(!!resumeData.skills && resumeData.skills.length > 0);
        setHasWorkExperience(!!resumeData.workExperience && resumeData.workExperience.length > 0);
        setHasEducation(!!resumeData.education && resumeData.education.length > 0);
    }, [resumeData]);

    return(
        <div>
            <HeaderSection
                resumeData={resumeData}/>
            <SummarySection
                resumeData={resumeData}/>
            <ContactInfoSection
                resumeData={resumeData}/>
            <Container style={{
                // ...DESIGN_BORDER
            }} className={"subSections-container"}>
                {hasSkills && <SkillsSection
                    resumeData={resumeData}/>}
                {hasWorkExperience && <WorkExperienceSection
                    resumeData={resumeData}/>}
                {hasEducation && <EducationSection
                    resumeData={resumeData}/>}
                {hasProjects && <ProjectsSection
                    resumeData={resumeData}/>}
            </Container>
            {/*<EducationSection/>*/}
            {/*<CertificationsSection/>*/}
        </div>
    );
}