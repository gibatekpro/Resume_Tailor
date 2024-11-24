import React, { useState } from "react";
import {Col, Row} from "react-bootstrap";

interface LanguageSectionProps {
    resumeFormFormik: any; // Replace 'any' with the type from your Formik configuration.
    inputFieldClassName: string;
    index: number;
}

export const LanguageSection: React.FC<LanguageSectionProps> = ({
                                                                    resumeFormFormik,
                                                                    inputFieldClassName,
                                                                    index,
                                                                }) => {
    const [isIconVisible, setIsIconVisible] = useState(false);
    const languages = resumeFormFormik.values.languages || [];
    const language = languages[index];

    const removeLanguage = () => {
        const updatedLanguages = resumeFormFormik.values.languages.filter(
            (_: any, idx: number) => idx !== index
        );
        resumeFormFormik.setFieldValue("languages", updatedLanguages);
    }

    if (!language) return null;

    return (
        <>
            <div
                className="mb-0 flex items-center justify-between bg-white"
                onMouseEnter={() => setIsIconVisible(true)}
                onMouseLeave={() => setIsIconVisible(false)}
            >
                <div className="flex items-center flex-1">
                    <span className=" font-normal sm:text-sm pl-3.5 text-gray-500">Language:</span>

                    <input
                        id={`language-${language.id}-name`}
                        name={`languages.${index}.name`} // Corrected name for Formik binding
                        type="text"
                        placeholder="Language"
                        className={`${inputFieldClassName} font-bold`}
                        onChange={resumeFormFormik.handleChange}
                        value={language.name || ""}
                    />
                </div>

                {isIconVisible && languages.length > 1 && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-500 cursor-pointer mr-3 ml-2"
                        onClick={removeLanguage}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                    </svg>
                )}
            </div>

            <Row
                className="mb-1 pb-2 bg-white mx-0 row row-cols-4 row-cols-sm-4
                row-cols-md-4 row-cols-lg-12 row-gap-3 row-gap-sm-3
                row-gap-md-3 row-gap-lg-0"
            >
                <Col lg={1} sm={1} xs={1} className={"mr-4 mr-md-2 "}>
                    <span className="font-normal text-gray-500">Level:</span>
                </Col>
                <Col lg={3} sm={2} xs={2}  className={"mr-4 mr-md-2 "}>
                    <label className="d-flex align-items-center">
                        <input
                            id={`language-${language.id}-proficiency-basic`}
                            name={`languages.${index}.proficiency`}
                            type="radio"
                            className="me-2"
                            onChange={resumeFormFormik.handleChange}
                            value="Basic"
                            checked={language.proficiency === "Basic"}
                        />
                        Basic
                    </label>
                </Col>
                <Col lg={3} sm={3} xs={2} className={"mr-4 mr-md-2 "}>
                    <label className="d-flex align-items-center">
                        <input
                            id={`language-${language.id}-proficiency-fluent`}
                            name={`languages.${index}.proficiency`}
                            type="radio"
                            className="me-2"
                            onChange={resumeFormFormik.handleChange}
                            value="Fluent"
                            checked={language.proficiency === "Fluent"}
                        />
                        Fluent
                    </label>
                </Col>
                <Col lg={3} sm={3}>
                    <label className="d-flex align-items-center">
                        <input
                            id={`language-${language.id}-proficiency-intermediate`}
                            name={`languages.${index}.proficiency`}
                            type="radio"
                            className="me-2"
                            onChange={resumeFormFormik.handleChange}
                            value="Intermediate"
                            checked={language.proficiency === "Intermediate"}
                        />
                        Intermediate
                    </label>
                </Col>
            </Row>

        </>
    );
};
