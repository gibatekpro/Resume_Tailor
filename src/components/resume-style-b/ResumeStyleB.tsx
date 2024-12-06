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
import {DefaultResumeData} from "../../data/defaultResumeData";
import {LOCAL_STORAGE_RESUME_DATA} from "../../data/applicationData";
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";
import {ResumeInfo} from "../../models/ResumeInfo";


export const ResumeStyleB: React.FC<{resumeData: ResumeInfo}> = ({resumeData}) =>{

    const [hasProjects, setHasProjects] = useState(!!resumeData.projects && resumeData.projects.length > 0);
    const [hasLanguage, setHasLanguage] = useState(!!resumeData.languages && resumeData.languages.length > 0);
    const [hasSummary, setHasSummary] = useState(!!resumeData.profile?.summary);
    const [hasSkills, setHasSkills] = useState(!!resumeData.skills && resumeData.skills.length > 0);
    const [hasWorkExperience, setHasWorkExperience] = useState(!!resumeData.workExperience && resumeData.workExperience.length > 0);
    const [hasEducation, setHasEducation] = useState(!!resumeData.education && resumeData.education.length > 0);
    const [hasContactInfo, setHasContactInfo] = useState(!!resumeData.contactInfo && resumeData.contactInfo.length > 0);

    useEffect(() => {
        // Update state for sections visibility

        setHasProjects(!!resumeData.projects && resumeData.projects.length > 0);
        setHasLanguage(!!resumeData.languages && resumeData.languages.length > 0);
        setHasSkills(!!resumeData.skills && resumeData.skills.length > 0);
        setHasWorkExperience(!!resumeData.workExperience && resumeData.workExperience.length > 0);
        setHasEducation(!!resumeData.education && resumeData.education.length > 0);
        setHasContactInfo(!!resumeData.contactInfo && resumeData.contactInfo.length > 0);
    }, [resumeData]);

    return(
        <div className={"style-b-main-container"} style={{
            // ...DESIGN_BORDER,
            borderColor: "#015a84"
        }}>
            <Row className={"main-row"} style={{
                border: '1px solid #015a84',
                paddingLeft: "0",
                margin:"0",
            }}>
                <CustomCol className={"left-col"} isLeft={true}
                    style={{
                        // ...DESIGN_BORDER,
                        // backgroundColor: "#015a84"
                    }}>
                    <AvatarSection/>
                    {hasContactInfo && (
                        <ContactInfoSection
                            resumeData={resumeData}
                        />
                    )}
                    {hasSkills && (
                        <SkillsSection
                            resumeData={resumeData}/>
                    )}
                    {hasLanguage && (
                        <LanguageSection
                            resumeData={resumeData}/>
                    )}
                </CustomCol>
                <CustomCol className={"right-col"} isLeft={false}
                    style={{
                        // ...DESIGN_BORDER
                    }}>
                    <HeaderSection
                        resumeData={resumeData}/>
                    <div className={"sub-right-col"}>
                        <SummarySection
                            resumeData={resumeData}/>
                        {hasWorkExperience && (
                            <WorkExperienceSection
                                resumeData={resumeData}/>
                        )}
                        {hasEducation && (
                            <EducationSection
                                resumeData={resumeData}/>
                        )}
                        {hasProjects && (
                            <ProjectsSection
                                resumeData={resumeData}/>
                        )}
                    </div>
                </CustomCol>
            </Row>
        </div>
    );
}