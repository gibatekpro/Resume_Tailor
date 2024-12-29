import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import {ProjectDetailInput} from "./ProjectDetailInput";
import {MONTHS, YEARS} from "../../../../../data/applicationData";

interface ProjectsSectionProps {
    resumeFormFormik: any; // Replace 'any' with the type from your Formik configuration.
    inputFieldClassName: string;
    index: number;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
                                                                    resumeFormFormik,
                                                                    inputFieldClassName,
                                                                    index,
                                                                }) => {
    const projectList = resumeFormFormik.values.projects;
    const projects = projectList[index];
    const [isIconVisible, setIsIconVisible] = useState(false);

    const addProjectDetail = () => {
        const updatedProjectDetails = [...(projects.projectDetails || []), ""];
        resumeFormFormik.setFieldValue(`projects[${index}].projectDetails`, updatedProjectDetails);
    };

    const removeProjectDetail = (projectIndex: number) => {
        const updatedProjectDetails = projects.projectDetails.filter(
            (_: any, idx: number) => idx !== projectIndex
        );
        if (projects.projectDetails.length > 1) {
            resumeFormFormik.setFieldValue(
                `projects[${index}].projectDetails`,
                updatedProjectDetails
            );
        }
    };

    const removeProjects = () => {
        const updatedProjects = projectList.filter(
            (_: any, idx: number) => idx !== index
        );
        resumeFormFormik.setFieldValue("projects", updatedProjects);
    };

    if (!projects) return null;

    return (
        <>

            <div className="grid grid-cols-2 gap-1 mb-1">
                <div className="bg-white">
                    <input
                        id={`projects-${projects.id}-projectName`}
                        name={`projects[${index}].projectName`}
                        type="text"
                        placeholder="Project Name"
                        className={inputFieldClassName}
                        onChange={resumeFormFormik.handleChange}
                        value={projects.projectName || ""}
                    />
                </div>
                <div className="bg-white flex items-center">
                    <input
                        id={`projects-${projects.id}-role`}
                        name={`projects[${index}].role`}
                        type="text"
                        placeholder="Role"
                        className={inputFieldClassName}
                        onChange={resumeFormFormik.handleChange}
                        value={projects.role || ""}
                    />
                    <>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 ml-2 text-gray-500 cursor-pointer mr-1"
                            onClick={removeProjects}
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
                    id={`projects-${projects.id}-link`}
                    name={`projects[${index}].link`}
                    type="url"
                    placeholder="Project Website"
                    className={inputFieldClassName}
                    onChange={resumeFormFormik.handleChange}
                    value={projects.link}
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
                            id={`projects-${projects.id}-startMonth`}
                            name={`projects[${index}].startMonth`}
                            className={inputFieldClassName + " sm:text-sm"}
                            onChange={resumeFormFormik.handleChange}
                            value={projectList[index]?.startMonth || ""}
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
                            id={`projects-${projects.id}-startYear`}
                            name={`projects[${index}].startYear`}
                            className={inputFieldClassName + " sm:text-sm"}
                            onChange={resumeFormFormik.handleChange}
                            value={projectList[index]?.startYear || ""}
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
                            id={`projects-${projects.id}-endMonth`}
                            name={`projects[${index}].endMonth`}
                            className={inputFieldClassName + " sm:text-sm"}
                            onChange={resumeFormFormik.handleChange}
                            value={projectList[index]?.endMonth || ""}
                            defaultValue={MONTHS[0]}
                        >
                            {MONTHS.map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col lg={3}  className={"mb-2 mb-md-0"}>
                        <select
                            id={`projects-${projects.id}-endYear`}
                            name={`projects[${index}].endYear`}
                            className={inputFieldClassName + " sm:text-sm"}
                            onChange={resumeFormFormik.handleChange}
                            value={projectList[index]?.endYear || ""}
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
                {projects.projectDetails?.map((_: any, projectDetailIndex: number) => (
                    <ProjectDetailInput
                        key={projectDetailIndex}
                        projectDetailIndex={projectDetailIndex}
                        resumeFormFormik={resumeFormFormik}
                        projectIndex={index}
                        inputFieldClassName={inputFieldClassName}
                        addProjectDetail={addProjectDetail}
                        removeProjectDetail={(projectDetailIndex:number) => removeProjectDetail(projectDetailIndex)}
                    />
                ))}
            </div>
        </>
    );
};
