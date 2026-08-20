import React, {useState} from "react";
import {colors} from "../../../../styles/theme";

interface ContactInfoSectionProps {
    resumeFormFormik: any; // Replace 'any' with the type from your Formik configuration.
    inputFieldClassName: string;
    index: number;
}

export const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
                                                                          resumeFormFormik,
                                                                          inputFieldClassName,
                                                                          index,
                                                                      }) => {
    const [isIconVisible, setIsIconVisible] = useState(false);
    const contactInfoList = resumeFormFormik.values.contactInfo || [];
    const contactInfo = contactInfoList[index];

    const removeContactInfo = () => {
        const updatedContactInfo = contactInfoList.filter((_: string, idx: number) => idx !== index);
        resumeFormFormik.setFieldValue("contactInfo", updatedContactInfo);
    };

    if (!contactInfo) return null;

    const shouldShowLinkInput = contactInfo.infoTitle === "LinkedIn" || contactInfo.infoTitle === "GitHub";
    const shouldShowInfoDetailsInput = ["Email", "Phone", "Location"].includes(contactInfo.infoTitle);

    const contactTypeOptions = ["Email", "Phone", "Location", "GitHub", "LinkedIn"];
    const fieldLabel = shouldShowLinkInput ? "Profile link" : "Contact details";
    const fieldPlaceholder = shouldShowLinkInput
        ? `${contactInfo.infoTitle} URL`
        : (contactInfo.infoTitle || "Details");

    return (
        <div
            className="border border-[#dfe4ee] bg-transparent p-3 transition-all duration-200"
            onMouseEnter={() => setIsIconVisible(true)}
            onMouseLeave={() => setIsIconVisible(false)}
        >
            <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                    <div className="flex flex-wrap gap-1.5">
                        {contactTypeOptions.map((option) => {
                            const checked = contactInfo.infoTitle === option;

                            return (
                                <label
                                    key={option}
                                    className={`inline-flex cursor-pointer items-center rounded-md border px-2.5 py-1 text-[11px] font-semibold leading-5 transition-all duration-200 ${
                                        checked
                                            ? "border-[#2170e4] bg-[#eef4fc] text-[#1f4f9c] shadow-[0_1px_3px_rgba(33,112,228,0.18)]"
                                            : "border-[#dfe4ee] bg-white text-[#45464d] hover:border-[#bfd5ff] hover:text-[#161c22]"
                                    }`}
                                >
                                    <input
                                        id={`contactInfo-${index}-infoTitle-${option.toLowerCase()}`}
                                        name={`contactInfo.${index}.infoTitle`}
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

                <button
                    type="button"
                    onClick={removeContactInfo}
                    disabled={contactInfoList.length <= 1}
                    className={`cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-md border transition-all duration-200 ${
                        contactInfoList.length > 1
                            ? `${isIconVisible ? "opacity-100" : "opacity-70"}`
                            : "cursor-not-allowed border-[#eceff5] bg-[#f6f7fb] text-[#a9afbb]"
                    }`}
                    aria-label="Remove contact info"
                    style={contactInfoList.length > 1 ? {color: colors.error, borderColor: colors.error} : undefined}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-4 w-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                    </svg>
                </button>
            </div>

            <div className="border border-[#e7ebf3] bg-white p-2.5">
                <p className="mb-1 text-[11px] font-medium text-[#6b7280]">{fieldLabel}</p>

                {shouldShowLinkInput && (
                    <input
                        id={`contactInfo-${index}-infoLink`}
                        name={`contactInfo.${index}.infoLink`}
                        type="url"
                        placeholder={fieldPlaceholder}
                        className={`${inputFieldClassName} mt-0 font-normal`}
                        onChange={resumeFormFormik.handleChange}
                        value={contactInfo.infoLink || ""}
                    />
                )}

                {shouldShowInfoDetailsInput && (
                    <input
                        id={`contactInfo-${index}-infoDetails`}
                        name={`contactInfo.${index}.infoDetails`}
                        type="text"
                        placeholder={fieldPlaceholder}
                        className={`${inputFieldClassName} mt-0 font-normal`}
                        onChange={resumeFormFormik.handleChange}
                        value={contactInfo.infoDetails || ""}
                    />
                )}
            </div>
        </div>
    );
};
