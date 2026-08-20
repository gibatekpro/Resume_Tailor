import type { ResumeInfo } from "../../../models/ResumeInfo";
import React from "react";
import {ProfileSection} from "./sections/ProfileSection";
import {SectionHeader} from "./sections/SectionHeader";
import {SkillsSection} from "./sections/skillSection/SkillsSection";
import {EducationSection} from "./sections/EducationSection";
import {LanguageSection} from "./sections/LanguageSection";
import {ProjectsSection} from "./sections/projectsSection/ProjectsSection";
import {ContactInfoSection} from "./sections/ContactInfoSection";
import {WorkExperienceSection} from "./sections/workExperienceSection/WorkExperienceSection";
import {Button, Spinner} from "react-bootstrap";

interface ResumeFormProps {
    resumeFormFormik: any;
    hasSubmitButton?: boolean;
    buttonTitle?: string;
}

const ResumeForm: React.FC<ResumeFormProps> = ({resumeFormFormik, hasSubmitButton = false, buttonTitle}) => {
    const isLoading = false;
    const inputFieldClassName =
        "mt-1 block w-full border border-[#c6c6cd] bg-[#f6f9ff] px-4 py-2 text-[14px] text-[#161c22] transition-all duration-200 ease-out placeholder:text-[#76777d] focus:border-[#2170e4] focus:outline-none focus:ring-2 focus:ring-[#d8e2ff] focus:ring-offset-0";


    const addToSection = (section: keyof ResumeInfo) => {
        const currentSectionData = (resumeFormFormik.values[section] as any[]) || []; // Explicitly cast to array

        // Add a new default item based on the section
        let newItem;
        if (section === "workExperience") {
            newItem = {
                companyName: "",
                jobTitle: "",
                startMonth: "",
                startYear: "",
                endMonth: "",
                endYear: "",
                duties: [""],
            };
        } else if (section === "education") {
            newItem = {
                institutionName: "",
                degree: "",
                course: "",
                startMonth: "",
                startYear: "",
                endMonth: "",
                endYear: "",
                current: false,
                link: ""
            };
        } else if (section === "projects") {
            newItem = {
                projectName: "",
                role: "",
                projectDetails: [
                    ""
                ],
                startMonth: "",
                startYear: "",
                endMonth: "",
                endYear: "",
                current: false,
                link: ""
            };
        } else if (section === "languages") {
            newItem = {
                name: "",
                proficiency: ""
            }
        } else if (section === "contactInfo") {
            newItem = {
                infoTitle: "",
                infoDetails: "",
                infoLink: ""
            }
        } else if (section === "skills") {
            newItem = ""
        } else {
            console.error(`Add to section not implemented for section: ${section}`);
            return;
        }

        // Update the section with the new item
        resumeFormFormik.setFieldValue(section, [...currentSectionData, newItem]);
    };


    const removeSection = (section: string) => {
        resumeFormFormik.setFieldValue(section, null);
    }



    return (
        <div className="w-full sm:px-1">
            <form onSubmit={resumeFormFormik.handleSubmit} className="w-full">
                {resumeFormFormik.values.profile &&
                    <SectionHeader
                        title={"About"}
                        addToSection={() => addToSection("profile")}
                        removeSection={() => removeSection("profile")}
                        hasAddIcon={false}
                        hasDeleteIcon={false}
                    />
                }
                <ProfileSection
                    resumeFormFormik={resumeFormFormik}
                    inputFieldClassName={inputFieldClassName}
                />

                {resumeFormFormik.values.contactInfo &&
                    <SectionHeader
                        title={"Contact Info"}
                        addToSection={() => addToSection("contactInfo")}
                        removeSection={() => removeSection("contactInfo")}
                        hasAddIcon={true}
                        hasDeleteIcon={true}
                    />
                }
                {resumeFormFormik.values.contactInfo?.map((_: string, index: number) => (
                    <div key={index} className="mb-0 pb-0">
                        <ContactInfoSection
                            resumeFormFormik={resumeFormFormik}
                            inputFieldClassName={inputFieldClassName}
                            index={index}
                        />
                    </div>
                ))}

                {resumeFormFormik.values.skills &&
                    <SectionHeader
                        title={"Skill"}
                        addToSection={() => addToSection("skills")}
                        removeSection={() => removeSection("skills")}
                        hasAddIcon={true}
                        hasDeleteIcon={true}
                    />
                }
                <div className="mb-2 pb-4">
                    <SkillsSection
                        resumeFormFormik={resumeFormFormik}
                        inputFieldClassName={inputFieldClassName}
                    />
                </div>

                {resumeFormFormik.values.workExperience &&
                    <SectionHeader
                        title={"Work Experience"}
                        addToSection={() => addToSection("workExperience")}
                        removeSection={() => removeSection("workExperience")}
                        hasAddIcon={true}
                        hasDeleteIcon={true}
                    />
                }
                {resumeFormFormik.values.workExperience?.map((_: string, index: number) => (
                    <div key={index} className="mb-2 pb-4">
                        <WorkExperienceSection
                            resumeFormFormik={resumeFormFormik}
                            inputFieldClassName={inputFieldClassName}
                            index={index}
                        />
                    </div>
                ))}

                {resumeFormFormik.values.education &&
                    <SectionHeader
                        title={"Education"}
                        addToSection={() => addToSection("education")}
                        removeSection={() => removeSection("education")}
                        hasAddIcon={true}
                        hasDeleteIcon={true}
                    />
                }
                {resumeFormFormik.values.education?.map((_: string, index: number) => (
                    <div key={index} className="mb-2 pb-4">
                        <EducationSection
                            resumeFormFormik={resumeFormFormik}
                            inputFieldClassName={inputFieldClassName}
                            index={index}
                        />
                    </div>
                ))}

                {resumeFormFormik.values.projects &&
                    <SectionHeader
                        title={"Projects"}
                        addToSection={() => addToSection("projects")}
                        removeSection={() => removeSection("projects")}
                        hasAddIcon={true}
                        hasDeleteIcon={true}
                    />
                }
                {resumeFormFormik.values.projects?.map((_: string, index: number) => (
                    <div key={index} className="mb-2 pb-4">
                        <ProjectsSection
                            resumeFormFormik={resumeFormFormik}
                            inputFieldClassName={inputFieldClassName}
                            index={index}
                        />
                    </div>
                ))}


                {resumeFormFormik.values.languages &&
                    <SectionHeader
                        title={"Language"}
                        addToSection={() => addToSection("languages")}
                        removeSection={() => removeSection("languages")}
                        hasAddIcon={true}
                        hasDeleteIcon={true}
                    />
                }
                {resumeFormFormik.values.languages?.map((_: string, index: number) => (
                    <div key={index} className="mb-0 pb-0">
                        <LanguageSection
                            resumeFormFormik={resumeFormFormik}
                            inputFieldClassName={inputFieldClassName}
                            index={index}
                        />
                    </div>
                ))}

                {hasSubmitButton && (
                    <Button
                        type="submit"
                        className="cursor-pointer mt-4 w-full border border-[#c6c6cd] bg-[#2170e4] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_1px_3px_rgba(15,23,42,0.05)] transition-all duration-200 ease-out hover:bg-[#185fd1] disabled:cursor-not-allowed disabled:opacity-70"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Generating...
                            </>
                        ) : (
                            buttonTitle
                        )}
                    </Button>
                )}
            </form>
        </div>

    );
};

export default ResumeForm;
