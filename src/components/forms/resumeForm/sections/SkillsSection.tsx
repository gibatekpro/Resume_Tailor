import React, {useState} from "react";
import {MONTHS} from "../../../../data/applicationData";

interface SkillsSectionProps {
    resumeFormFormik: any; // Replace 'any' with the type from your Formik configuration.
    inputFieldClassName: string;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
                                                                resumeFormFormik,
                                                                inputFieldClassName,
                                                            }) => {
    const skills = resumeFormFormik.values.skills || [];

    const addSkill = () => {
        const updatedDuties = [...(skills || []), ""];
        resumeFormFormik.setFieldValue(`skills`, updatedDuties);
    };

    const removeSkill = (skillIndex: number) => {
        const updatedSkills = skills.filter((_: any, idx: number) => idx !== skillIndex);
        if (skills.length > 1) {
            resumeFormFormik.setFieldValue(`skills`, updatedSkills);
        }

    };

    const SkillInput: React.FC<{ skillIndex: number }> = ({skillIndex}) => {
        const [isIconVisible, setIsIconVisible] = useState(false);

        return (
            <div className="flex items-center bg-white mt-1"
                 onMouseEnter={() => setIsIconVisible(true)}
                 onMouseLeave={() => setIsIconVisible(false)}
            >

                <input
                    id={`skills-${skillIndex}`}
                    name={`skills[${skillIndex}]`}
                    type="text"
                    placeholder="Add Skill"
                    className={`${inputFieldClassName} flex-1`}
                    onChange={resumeFormFormik.handleChange}
                    value={skills[skillIndex] || ""}
                />
                {isIconVisible && (
                    <>
                        {skills.length - 1 === skillIndex && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 ml-2 text-gray-500 cursor-pointer mr-1"
                                onClick={addSkill}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                            </svg>
                        )}
                        {skills.length > 1 && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 ml-2 text-gray-500 cursor-pointer mr-1"
                                onClick={() => removeSkill(skillIndex)}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                            </svg>
                        )}
                    </>
                )}
            </div>
        );
    };


    if (!skills) return null;

    return (
        <>
            <div className=" bg-white mb-1">
                {resumeFormFormik.values.skills?.map((_: string, skillIndex: number) => (
                    <SkillInput key={skillIndex} skillIndex={skillIndex}/>
                ))}
            </div>
        </>
    );
};