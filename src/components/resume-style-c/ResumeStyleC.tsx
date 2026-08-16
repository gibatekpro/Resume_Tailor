import React from "react";
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