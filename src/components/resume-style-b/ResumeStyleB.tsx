import React, {useEffect, useState} from "react";
import '../../styles/resumeStyleB.css';
import {useResumeProvider} from "../../context/ResumeContext";
import {DESIGN_BORDER} from "../../constants/DesignConstants";
import {CertificationsSection} from "./CertificationsSection";
import {Col, Row} from "react-bootstrap";
import {CustomCol} from "../../custom_tags/CustomCol";
import {SkillsSection} from "./SkillsSection";
import {ContactInfoSection} from "./ContactInfoSection";
import {HeaderSection} from "./HeaderSection";
import {SummarySection} from "./SummarySection";
import {WorkExperienceSection} from "./WorkExperienceSection";
import {EducationSection} from "./EducationSection";
import {ProjectsSection} from "./ProjectsSection";
import {AvatarSection} from "./AvatarSection";
import {LanguageSection} from "./LanguageSection";

export const ResumeStyleB: React.FC = () =>{
    const {resumeData, setResumeData} = useResumeProvider();
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
        <div className={"style-b-main-container"} style={{
            ...DESIGN_BORDER,
            borderColor: "#015a84"
        }}>
            <Row className={"main-row"} style={{
                paddingLeft: "0",
                margin:"0"
            }}>
                <CustomCol className={"left-col"} isLeft={true}
                    style={{
                        // ...DESIGN_BORDER,
                        // backgroundColor: "#015a84"
                    }}>
                    <AvatarSection/>
                    <ContactInfoSection/>
                    <SkillsSection/>
                    <LanguageSection/>
                </CustomCol>
                <CustomCol className={"right-col"} isLeft={false}
                    style={{
                        // ...DESIGN_BORDER
                    }}>
                    <HeaderSection/>
                    <div className={"sub-right-col"}>
                        <SummarySection/>
                        <WorkExperienceSection/>
                        <EducationSection/>
                        <ProjectsSection/>
                    </div>
                </CustomCol>
            </Row>
        </div>
    );
}