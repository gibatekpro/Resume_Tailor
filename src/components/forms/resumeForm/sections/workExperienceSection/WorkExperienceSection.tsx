import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import {MONTHS, YEARS} from "../../../../../data/applicationData";
import {DutyInput} from "./DutyInput";

interface WorkExperienceSectionProps {
    resumeFormFormik: any; // Replace 'any' with the type from your Formik configuration.
    inputFieldClassName: string;
    index: number;
}

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
                                                                                resumeFormFormik,
                                                                                inputFieldClassName,
                                                                                index,
                                                                            }) => {
    const workExperienceList = resumeFormFormik.values.workExperience;
    const workExperience = workExperienceList[index];
    const [isIconVisible, setIsIconVisible] = useState(false);

    const addDuty = () => {
        const updatedDuties = [...(workExperience.duties || []), ""];
        resumeFormFormik.setFieldValue(`workExperience[${index}].duties`, updatedDuties);
    };

    const removeDuty = (dutyIndex: number) => {
        const updatedDuties = workExperience.duties.filter((_: any, idx: number) => idx !== dutyIndex);
        if (workExperience.duties.length > 1) {
            resumeFormFormik.setFieldValue(`workExperience[${index}].duties`, updatedDuties);
        }
    };

    const removeWorkExperience = () => {
        const updatedWorkExperience = workExperienceList.filter(
            (_: any, idx: number) => idx !== index
        );
        resumeFormFormik.setFieldValue("workExperience", updatedWorkExperience);
    };

    if (!workExperience) return null;

    return (
        <>
            <div className="grid grid-cols-2 gap-1 mb-1">
                <div className="bg-white">
                    <input
                        id={`workExperience-${workExperience.id}-companyName`}
                        name={`workExperience[${index}].companyName`}
                        type="text"
                        placeholder="Company Name"
                        className={inputFieldClassName}
                        onChange={resumeFormFormik.handleChange}
                        value={workExperience.companyName || ""}
                    />
                </div>
                <div className="bg-white flex items-center"
                     onMouseEnter={() => setIsIconVisible(true)}
                     onMouseLeave={() => setIsIconVisible(false)}>
                    <input
                        id={`workExperience-${workExperience.id}-jobTitle`}
                        name={`workExperience[${index}].jobTitle`}
                        type="text"
                        placeholder="Job Title"
                        className={inputFieldClassName}
                        onChange={resumeFormFormik.handleChange}
                        value={workExperience.jobTitle || ""}
                    />
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 ml-2 text-gray-500 cursor-pointer mr-1"
                                onClick={removeWorkExperience}
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
                    id={`workExperience-${workExperience.id}-website`}
                    name={`workExperience[${index}].website`}
                    type="url"
                    placeholder="Company Website"
                    className={inputFieldClassName}
                    onChange={resumeFormFormik.handleChange}
                    value={workExperience.website}
                />
            </div>

            <div className="grid grid-rows-2 gap-1 bg-white py-2 pl-4 pr-2">
                <Row className="
                row row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-12
                row-gap-3 row-gap-sm-3 row-gap-md-3 row-gap-lg-0"
                >
                    <Col lg={2} className={"flex justify-start"}>
                        <span className="text-sm font-normal text-gray-500">Start</span>
                    </Col>
                    <Col lg={3}>
                        <select
                            id={`workExperience-${workExperience.id}-startMonth`}
                            name={`workExperience[${index}].startMonth`}
                            className={inputFieldClassName + " sm:text-sm"}
                            onChange={resumeFormFormik.handleChange}
                            value={workExperienceList[index]?.startMonth || ""}
                            defaultValue={MONTHS[0]}
                        >
                            {MONTHS.map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col lg={3} className={"mb-4 mb-md-2"}>
                        <select
                            id={`workExperience-${workExperience.id}-startYear`}
                            name={`workExperience[${index}].startYear`}
                            className={inputFieldClassName + " sm:text-sm"}
                            onChange={resumeFormFormik.handleChange}
                            value={workExperienceList[index]?.startYear || ""}
                            defaultValue={YEARS[0]}
                        >
                            {YEARS.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </Col>
                </Row>

                <Row className="
                row row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-12
                row-gap-3 row-gap-sm-3 row-gap-md-3 row-gap-lg-0"
                >
                    <Col lg={2} className={"flex justify-start"}>
                        <span className="text-sm font-normal text-gray-500">End</span>
                    </Col>
                    <Col lg={3}>
                        <select
                            id={`workExperience-${workExperience.id}-endMonth`}
                            name={`workExperience[${index}].endMonth`}
                            className={inputFieldClassName + " sm:text-sm"}
                            onChange={resumeFormFormik.handleChange}
                            value={workExperienceList[index]?.endMonth || ""}
                            defaultValue={MONTHS[0]}
                        >
                            {MONTHS.map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col lg={3} className={"mb-2 mb-md-0"}>
                        <select
                            id={`workExperience-${workExperience.id}-endYear`}
                            name={`workExperience[${index}].endYear`}
                            className={inputFieldClassName + " sm:text-sm"}
                            onChange={resumeFormFormik.handleChange}
                            value={workExperienceList[index]?.endYear || ""}
                            defaultValue={YEARS[0]}
                        >
                            {YEARS.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </Col>
                </Row>
            </div>

            <div className="bg-white mb-1">
                {workExperience.duties?.map((_: any, dutyIndex: number) => (
                    <DutyInput
                        key={dutyIndex}
                        dutyIndex={dutyIndex}
                        resumeFormFormik={resumeFormFormik}
                        workExperienceIndex={index}
                        inputFieldClassName={inputFieldClassName}
                        addDuty={addDuty}
                        removeDuty={(dutyIndex:number) => removeDuty(dutyIndex)}
                    />
                ))}
            </div>
        </>
    );
};