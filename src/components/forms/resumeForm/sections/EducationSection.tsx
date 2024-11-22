import React, {useState} from "react";
import {MONTHS} from "../../../../data/applicationData";

interface EducationSectionProps {
    resumeFormFormik: any; // Replace 'any' with the type from your Formik configuration.
    inputFieldClassName: string;
    index: number;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
                                                                                resumeFormFormik,
                                                                                inputFieldClassName,
                                                                                index,
                                                                            }) => {
    const education = resumeFormFormik.values.education[index];

    const removeEducation = () => {
        const updatedEducation = resumeFormFormik.values.education.filter(
            (_: any, idx: number) => idx !== index
        );
        resumeFormFormik.setFieldValue("education", updatedEducation);
    };

    if (!education) return null;

    return (
        <>

            <div className="grid grid-cols-3 gap-1 mb-1">
                <div className="bg-white">
                    <input
                        id={`education-${education.id}-institutionName`}
                        name={`education[${index}].institutionName`}
                        type="text"
                        placeholder="Institution Name"
                        className={inputFieldClassName}
                        onChange={resumeFormFormik.handleChange}
                        value={education.institutionName || ""}
                    />
                </div>
                <div className="bg-white">
                    <input
                        id={`education-${education.id}-degree`}
                        name={`education[${index}].degree`}
                        type="text"
                        placeholder="Degree Name (Bachelors/Masters)"
                        className={inputFieldClassName}
                        onChange={resumeFormFormik.handleChange}
                        value={education.degree || ""}
                    />
                </div>
                <div className="bg-white flex items-center">
                    <input
                        id={`education-${education.id}-course`}
                        name={`education[${index}].course`}
                        type="text"
                        placeholder="Course Title"
                        className={inputFieldClassName}
                        onChange={resumeFormFormik.handleChange}
                        value={education.course || ""}
                    />
                    <>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 ml-2 text-gray-500 cursor-pointer mr-1"
                            onClick={removeEducation}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                        </svg>
                    </>
                </div>
            </div>


            <div className="mb-1">
                <input
                    id={`education-${education.id}-link`}
                    name={`education[${index}].link`}
                    type="url"
                    placeholder="Institution Website"
                    className={inputFieldClassName}
                    onChange={resumeFormFormik.handleChange}
                    value={education.link}
                />
            </div>

            <div className="grid grid-rows-2 gap-1 bg-white pb-2">
                <div className="grid grid-cols-6 gap-1 items-center px-3 pt-2">
                    <span className="text-sm font-bold">Start</span>
                    <select
                        id={`education-${education.id}-startMonth`}
                        name={`education[${index}].startMonth`}
                        className={inputFieldClassName + " sm:text-sm"}
                        onChange={resumeFormFormik.handleChange}
                        value={resumeFormFormik.values.education[index]?.startMonth || ""}
                    >
                        {MONTHS.map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                    <select
                        id={`education-${education.id}-startYear`}
                        name={`education[${index}].startYear`}
                        className={inputFieldClassName + " sm:text-sm"}
                        onChange={resumeFormFormik.handleChange}
                        value={resumeFormFormik.values.education[index]?.startYear || ""}
                    >
                        {Array.from({length: 50}, (_, i) => new Date().getFullYear() - i).map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-6 gap-1 items-center px-3 pt-2">
                    <span className="text-sm font-bold">End</span>
                    <select
                        id={`education-${education.id}-endMonth`}
                        name={`education[${index}].endMonth`}
                        className={inputFieldClassName + " sm:text-sm"}
                        onChange={resumeFormFormik.handleChange}
                        value={resumeFormFormik.values.education[index]?.endMonth || ""}
                    >
                        {MONTHS.map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                    <select
                        id={`education-${education.id}-endYear`}
                        name={`education[${index}].endYear`}
                        className={inputFieldClassName + " sm:text-sm"}
                        onChange={resumeFormFormik.handleChange}
                        value={resumeFormFormik.values.education[index]?.endYear || ""}
                    >
                        {Array.from({length: 50}, (_, i) => new Date().getFullYear() - i).map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    );
};
