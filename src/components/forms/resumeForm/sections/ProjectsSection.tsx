import React, {useState} from "react";
import {MONTHS} from "../../../../data/applicationData";

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
    const projects = resumeFormFormik.values.projects[index];

    const addProject = () => {
        const updatedProjectDetails = [...(projects.projectDetails || []), ""];
        resumeFormFormik.setFieldValue(`projects[${index}].projectDetails`, updatedProjectDetails);
    };

    const removeProject = (projectIndex: number) => {
        const updatedProjectDetails = projects.projectDetails.filter((_: any, idx: number) => idx !== projectIndex);
        if (projects.projectDetails.length > 1) {
            resumeFormFormik.setFieldValue(`projects[${index}].projectDetails`, updatedProjectDetails);
        }

    };


    const removeProjects = () => {
        const updatedProjects = resumeFormFormik.values.projects.filter(
            (_: any, idx: number) => idx !== index
        );
        resumeFormFormik.setFieldValue("projects", updatedProjects);
    };

    const ProjectInput: React.FC<{ projectIndex: number }> = ({ projectIndex }) => {
        const [isIconVisible, setIsIconVisible] = useState(false);

        return (
            <div className="flex items-center bg-white mt-1"
                 onMouseEnter={() => setIsIconVisible(true)}
                 onMouseLeave={() => setIsIconVisible(false)}
            >

                <input
                    id={`projects-${projects.id}-projectDetails-${projectIndex}`}
                    name={`projects[${index}].projectDetails[${projectIndex}]`}
                    type="text"
                    placeholder={`Add Project`}
                    className={`${inputFieldClassName} flex-1`}
                    onChange={resumeFormFormik.handleChange}
                    value={projects.projectDetails[projectIndex] || ""}
                />
                {isIconVisible && (
                    <>
                        {projects.projectDetails.length - 1 === projectIndex && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 ml-2 text-gray-500 cursor-pointer mr-1"
                                onClick={addProject}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        )}
                        {projects.projectDetails.length > 1 && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 ml-2 text-gray-500 cursor-pointer mr-1"
                                onClick={() => removeProject(projectIndex)}
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

            <div className="grid grid-rows-2 gap-1 bg-white pb-2">
                <div className="grid grid-cols-6 gap-1 items-center px-3 pt-2">
                    <span className="text-sm font-bold">Start</span>
                    <select
                        id={`projects-${projects.id}-startMonth`}
                        name={`projects[${index}].startMonth`}
                        className={inputFieldClassName + " sm:text-sm"}
                        onChange={resumeFormFormik.handleChange}
                        value={resumeFormFormik.values.projects[index]?.startMonth || ""}
                    >
                        {MONTHS.map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                    <select
                        id={`projects-${projects.id}-startYear`}
                        name={`projects[${index}].startYear`}
                        className={inputFieldClassName + " sm:text-sm"}
                        onChange={resumeFormFormik.handleChange}
                        value={resumeFormFormik.values.projects[index]?.startYear || ""}
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
                        id={`projects-${projects.id}-endMonth`}
                        name={`projects[${index}].endMonth`}
                        className={inputFieldClassName + " sm:text-sm"}
                        onChange={resumeFormFormik.handleChange}
                        value={resumeFormFormik.values.projects[index]?.endMonth || ""}
                    >
                        {MONTHS.map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                    <select
                        id={`projects-${projects.id}-endYear`}
                        name={`projects[${index}].endYear`}
                        className={inputFieldClassName + " sm:text-sm"}
                        onChange={resumeFormFormik.handleChange}
                        value={resumeFormFormik.values.projects[index]?.endYear || ""}
                    >
                        {Array.from({length: 50}, (_, i) => new Date().getFullYear() - i).map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className=" bg-white mb-1">
                {projects.projectDetails?.map((_: string, projectIndex: number) => (
                    <ProjectInput key={projectIndex} projectIndex={projectIndex}/>
                ))}
            </div>
        </>
    );
};