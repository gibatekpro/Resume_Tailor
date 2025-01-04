import React, {useEffect, useState} from "react";
import {ResumeInfo} from "../../models/ResumeInfo";
import {Col, Row} from "react-bootstrap";
import {HeaderSection} from "./HeaderSection";
import {ResumeStyleCStyle} from "./styles/ResumeStyleCStyle";
import {ContactInfoSection} from "./ContactInfoSection";
import {WorkExperienceSection} from "./WorkExperienceSection";
import {SummarySection} from "./SummarySection";
import {ProjectsSection} from "./ProjectsSection";
import {SkillsSection} from "./SkillsSection";
import {EducationSection} from "./EducationSection";
import {LanguageSection} from "./LanguageSection";


export const ResumeStyleC: React.FunctionComponent<{resumeData: ResumeInfo}> = ({resumeData}) => {
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
        <div style={
            ResumeStyleCStyle.mainContainer
        }>
            <Col style={{}}>
                <Row>
                    <Col defaultValue={6} style={
                        ResumeStyleCStyle.leftCol
                    }>
                        <HeaderSection resumeData={resumeData}/>
                    </Col>

                    <Col defaultValue={6} style={
                        ResumeStyleCStyle.rightCol
                    }>
                        <ContactInfoSection resumeData={resumeData}/>
                    </Col>
                </Row>
                <div style={{
                    ...ResumeStyleCStyle.largeSpacing
                }}></div>
                <SummarySection resumeData={resumeData}/>
                <div style={{
                    ...ResumeStyleCStyle.largeSpacing
                }}></div>
                <SkillsSection resumeData={resumeData}/>
                <div style={{
                    ...ResumeStyleCStyle.largeSpacing
                }}></div>
                <WorkExperienceSection resumeData={resumeData}/>
                <div style={{
                    ...ResumeStyleCStyle.largeSpacing
                }}></div>
                <ProjectsSection resumeData={resumeData}/>
                <div style={{
                    ...ResumeStyleCStyle.largeSpacing
                }}></div>
                <EducationSection resumeData={resumeData}/>
                <div style={{
                    ...ResumeStyleCStyle.largeSpacing
                }}></div>
                <LanguageSection resumeData={resumeData}/>
            </Col>
        </div>
    )
}