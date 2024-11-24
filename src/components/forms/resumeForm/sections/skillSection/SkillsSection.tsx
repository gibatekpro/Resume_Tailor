import React, {useEffect, useState} from "react";
import {MONTHS} from "../../../../../data/applicationData";
import { v4 as uuidv4 } from "uuid";
import {SkillInput} from "./SkillInput";

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


    if (!skills) return null;

    return (
        <>
            <div className=" bg-white mb-1">
                {resumeFormFormik.values.skills?.map((_: string, skillIndex: number) => (
                    <SkillInput
                        key={skillIndex}
                        skillIndex={skillIndex}
                        resumeFormFormik={resumeFormFormik}
                        inputFieldClassName={inputFieldClassName}
                        skills={skills}
                        addSkill={addSkill}
                        removeSkill={(skillIndex: number) => removeSkill(skillIndex)}
                    />
                ))}
            </div>
        </>
    );
};
