import {useFormik} from "formik";
import {ResumeInfo} from "../../../models/ResumeInfo";
import React, {useEffect} from "react";
import {ProfileSection} from "./sections/ProfileSection";
import {SectionHeader} from "./sections/SectionHeader";
import {SkillsSection} from "./sections/skillSection/SkillsSection";
import {EducationSection} from "./sections/EducationSection";
import {LanguageSection} from "./sections/LanguageSection";
import {ProjectsSection} from "./sections/projectsSection/ProjectsSection";
import {ContactInfoSection} from "./sections/ContactInfoSection";
import {useResumeProvider} from "../../../context/ResumeContext";
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
        "mt-1 block w-full px-3 py-2 focus:outline-none " +
        "focus:ring-0 focus:border-black focus:border-2 sm:text-sm";


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
        <div className="flex justify-center items-center sm:px-2">
            <form onSubmit={resumeFormFormik.handleSubmit}>
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
                        className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600"
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
