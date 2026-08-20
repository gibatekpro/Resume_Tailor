import React from "react";
import {MonthYearPicker} from "./shared/MonthYearPicker";
import {colors} from "../../../../styles/theme";

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
    const educationList = resumeFormFormik.values.education;
    const education = educationList[index];
    

    const removeEducation = () => {
        const updatedEducation = educationList.filter(
            (_: any, idx: number) => idx !== index
        );
        resumeFormFormik.setFieldValue("education", updatedEducation);
    };

    if (!education) return null;

    return (
        <>

              <div className="grid grid-cols-2 gap-1 mb-1">

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
                <div className="bg-white flex items-center">

                    <input
                        id={`education-${education.id}-degree`}
                        name={`education[${index}].degree`}
                        type="text"
                        placeholder="Degree Name (Bachelors/Masters)"
                        className={inputFieldClassName}
                        onChange={resumeFormFormik.handleChange}
                        value={education.degree || ""}
                    />

                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 ml-2 cursor-pointer mr-1"
                                onClick={removeEducation}
                                style={{color: colors.error}}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                            </svg>
                        </>
                </div>
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

            <div className="grid gap-2 bg-white py-2 pl-4 pr-2">
                <MonthYearPicker
                    label="Start"
                    idPrefix={`education-${education.id}`}
                    monthField={`education[${index}].startMonth`}
                    yearField={`education[${index}].startYear`}
                    monthValue={educationList[index]?.startMonth}
                    yearValue={educationList[index]?.startYear}
                    setFieldValue={resumeFormFormik.setFieldValue}
                    inputFieldClassName={inputFieldClassName}
                />

                <MonthYearPicker
                    label="End"
                    idPrefix={`education-${education.id}`}
                    monthField={`education[${index}].endMonth`}
                    yearField={`education[${index}].endYear`}
                    monthValue={educationList[index]?.endMonth}
                    yearValue={educationList[index]?.endYear}
                    setFieldValue={resumeFormFormik.setFieldValue}
                    inputFieldClassName={inputFieldClassName}
                />
            </div>
        </>
    );
};
