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


export const ResumeStyleB: React.FC = () =>{
    const saved = localStorage.getItem(LOCAL_STORAGE_RESUME_DATA);
    const resumeDataOpenAI = saved ? JSON.parse(saved) : DefaultResumeData;

    // const [hasProjects, setHasProjects] = useState(false);
    // const [hasSkills, setHasSkills] = useState(false);
    // const [hasWorkExperience, setHasWorkExperience] = useState(false);
    // const [hasEducation, setHasEducation] = useState(false);
    //
    // useEffect(() => {
    //     // Update state for sections visibility
    //
    //     setHasProjects(!!resumeDataOpenAI.projects && resumeDataOpenAI.projects.length > 0);
    //     setHasSkills(!!resumeDataOpenAI.skills && resumeDataOpenAI.skills.length > 0);
    //     setHasWorkExperience(!!resumeDataOpenAI.workExperience && resumeDataOpenAI.workExperience.length > 0);
    //     setHasEducation(!!resumeDataOpenAI.education && resumeDataOpenAI.education.length > 0);
    // }, []);

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
                    <ContactInfoSection
                        resumeDataOpenAI={resumeDataOpenAI}
                    />
                    <SkillsSection
                        resumeDataOpenAI={resumeDataOpenAI}/>
                    <LanguageSection
                        resumeDataOpenAI={resumeDataOpenAI}/>
                </CustomCol>
                <CustomCol className={"right-col"} isLeft={false}
                    style={{
                        // ...DESIGN_BORDER
                    }}>
                    <HeaderSection
                        resumeDataOpenAI={resumeDataOpenAI}/>
                    <div className={"sub-right-col"}>
                        <SummarySection
                            resumeDataOpenAI={resumeDataOpenAI}/>
                        <WorkExperienceSection
                            resumeDataOpenAI={resumeDataOpenAI}/>
                        <EducationSection
                            resumeDataOpenAI={resumeDataOpenAI}/>
                        <ProjectsSection
                            resumeDataOpenAI={resumeDataOpenAI}/>
                    </div>
                </CustomCol>
            </Row>
        </div>
    );
}