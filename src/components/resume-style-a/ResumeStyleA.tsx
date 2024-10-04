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
import {DESIGN_BORDER} from "../../constants/DesignConstants";
import {CertificationsSection} from "./CertificationsSection";

export const ResumeStyleA: React.FC = () =>{
    const {resumeData, setResumeData} = useResumeProvider();
    const [hasProjects, setHasProjects] = useState(false);
    const [hasSkills, setHasSkills] = useState(false);
    const [hasWorkExperience, setHasWorkExperience] = useState(false);
    const [hasEducation, setHasEducation] = useState(false);

    useEffect(() => {
        // Update state for sections visibility
        setHasProjects(resumeData.projects && resumeData.projects.length > 0);
        setHasSkills(resumeData.skills && resumeData.skills.length > 0);
        setHasWorkExperience(resumeData.workExperience && resumeData.workExperience.length > 0);
        setHasEducation(resumeData.education && resumeData.education.length > 0);
    }, [resumeData]);

    return(
        <div>
            <HeaderSection/>
            <SummarySection/>
            <ContactInfoSection/>
            <Container style={{
                // ...DESIGN_BORDER
            }} className={"subSections-container"}>
                {hasSkills && <SkillsSection />}
                {hasWorkExperience && <WorkExperienceSection/>}
                {hasEducation && <EducationSection/>}
                {hasProjects && <ProjectsSection/>}
            </Container>
            {/*<EducationSection/>*/}
            {/*<CertificationsSection/>*/}
        </div>
    );
}