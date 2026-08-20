import React, { useState } from "react";
import {Col, Row} from "react-bootstrap";
import {colors} from "../../../../styles/theme";

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

    const proficiencyOptions = ["Basic", "Intermediate", "Fluent"];

    return (
        <div className="border border-[#eef2f7] bg-transparent p-0">
            <div
                className="mb-2 flex items-center justify-between gap-3"
                onMouseEnter={() => setIsIconVisible(true)}
                onMouseLeave={() => setIsIconVisible(false)}
            >
                <div className="flex flex-1 items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#676a72]">Language</span>
                    <input
                        id={`language-${language.id}-name`}
                        name={`languages.${index}.name`}
                        type="text"
                        placeholder="Language"
                        className={`${inputFieldClassName} font-medium`}
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
                        className="w-6 h-6 cursor-pointer"
                        onClick={removeLanguage}
                        style={{color: colors.error}}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                    </svg>
                )}
            </div>

            <div className="mt-2">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#676a72]">Proficiency</p>
            <div className="flex flex-wrap gap-1.5">
                    {proficiencyOptions.map((option) => {
                        const checked = language.proficiency === option;
                        return (
                            <label
                                key={option}
                            className={`inline-flex cursor-pointer items-center border px-2 py-1 text-xs font-medium transition-all duration-200 ${
                                    checked
                                    ? "border-[#2170e4] bg-[#eef4fc] text-[#2170e4]"
                                        : "border-[#dfe4ee] bg-white text-[#45464d] hover:border-[#bfd5ff] hover:text-[#161c22]"
                                }`}
                            >
                                <input
                                    id={`language-${language.id}-proficiency-${option.toLowerCase()}`}
                                    name={`languages.${index}.proficiency`}
                                    type="radio"
                                    className="sr-only"
                                    onChange={resumeFormFormik.handleChange}
                                    value={option}
                                    checked={checked}
                                />
                                <span>{option}</span>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
