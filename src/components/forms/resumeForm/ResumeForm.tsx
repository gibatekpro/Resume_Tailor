import {useFormik} from "formik";
import {ResumeInfo} from "../../../models/ResumeInfo";
import React, {useEffect} from "react";
import {ProfileSection} from "./sections/ProfileSection";
import {WorkExperienceSection} from "./sections/WorkExperienceSection";
import {SectionHeader} from "./sections/SectionHeader";
import {SkillsSection} from "./sections/SkillsSection";
import {EducationSection} from "./sections/EducationSection";
import {LanguageSection} from "./sections/LanguageSection";
import {ProjectsSection} from "./sections/ProjectsSection";
import {ContactInfoSection} from "./sections/ContactInfoSection";
import {useResumeProvider} from "../../../context/ResumeContext";

const ResumeForm: React.FC<{ onValuesChange: (values: any) => void }> = ({ onValuesChange }) => {
    const {resumeData, setResumeData} = useResumeProvider();
    const inputFieldClassName =
        "mt-1 block w-full px-3 py-2 focus:outline-none " +
        "focus:ring-0 focus:border-black focus:border-2 sm:text-sm";

    // const defaultValues: ResumeInfo = {
    //     workExperience: initialFormValues?.workExperience || [...resumeData.workExperience],
    //     skills: initialFormValues?.skills || [...resumeData.skills],
    //     education: initialFormValues?.education || [...resumeData.education],
    //     languages: initialFormValues?.languages || [...resumeData.languages],
    //     profile: initialFormValues?.profile || {...resumeData.profile},
    // };
    // Emit changes to the parent

    const defaultValues: ResumeInfo = {
        workExperience: [...resumeData.workExperience || []],
        projects: [...resumeData.projects || []],
        skills: [...resumeData.skills || []],
        education: [...resumeData.education || []],
        languages: [...resumeData.languages || []],
        contactInfo: [...resumeData.contactInfo || []],
        profile: {...resumeData.profile},
    };

    const resumeFormFormik = useFormik({
        initialValues: defaultValues,
        onSubmit: (values) => {
            console.log(values);
        },
    });

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
        }
        else if (section === "projects") {
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
                link: "https://github.com/gibatekpro"
            };
        }
        else if (section === "languages") {
            newItem = {
                name: "",
                proficiency: ""
            }
        }
        else if (section === "contactInfo") {
            newItem = {
                infoTitle: "",
                infoDetails: "",
                infoLink: ""
            }
        }
        else {
            console.error(`Add to section not implemented for section: ${section}`);
            return;
        }

        // Update the section with the new item
        resumeFormFormik.setFieldValue(section, [...currentSectionData, newItem]);
    };


    const removeSection = (section: string) => {
        resumeFormFormik.setFieldValue(section, null);
    }

    useEffect(() => {
        onValuesChange(resumeFormFormik.values);
        setResumeData(resumeFormFormik.values);
    }, [resumeFormFormik.values]);


    return (
        <div className="col-md-8">
            <div className="flex justify-center items-center">
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
                        {resumeFormFormik.values.contactInfo?.map((_, index) => (
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
                                hasAddIcon={false}
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
                        {resumeFormFormik.values.workExperience?.map((_, index) => (
                            <div key={index} className="mb-2 pb-4">
                                <WorkExperienceSection
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
                        {resumeFormFormik.values.projects?.map((_, index) => (
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
                        {resumeFormFormik.values.languages?.map((_, index) => (
                            <div key={index} className="mb-0 pb-0">
                                <LanguageSection
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
                        {resumeFormFormik.values.education?.map((_, index) => (
                            <div key={index} className="mb-2 pb-4">
                                <EducationSection
                                    resumeFormFormik={resumeFormFormik}
                                    inputFieldClassName={inputFieldClassName}
                                    index={index}
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </form>
            </div>
        </div>

    );
};

export default ResumeForm;
