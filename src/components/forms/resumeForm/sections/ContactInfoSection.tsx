import React, { useState } from "react";

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

    return (
        <>
            <div className="flex items-center mb-0 px-3.5 bg-white pt-2 pb-2">
                <span className="mr-4 font-normal sm:text-sm text-gray-500">Type: </span>

                <label className="flex items-center mr-4 sm:text-sm">
                    <input
                        id={`contactInfo-${index}-infoTitle-linkedin`}
                        name={`contactInfo.${index}.infoTitle`}
                        type="radio"
                        className="mr-2"
                        onChange={resumeFormFormik.handleChange}
                        value="LinkedIn"
                        checked={contactInfo.infoTitle === "LinkedIn"}
                    />
                    LinkedIn
                </label>

                <label className="flex items-center mr-4 sm:text-sm">
                    <input
                        id={`contactInfo-${index}-infoTitle-email`}
                        name={`contactInfo.${index}.infoTitle`}
                        type="radio"
                        className="mr-2"
                        onChange={resumeFormFormik.handleChange}
                        value="Email"
                        checked={contactInfo.infoTitle === "Email"}
                    />
                    Email
                </label>

                <label className="flex items-center mr-4 sm:text-sm">
                    <input
                        id={`contactInfo-${index}-infoTitle-phone`}
                        name={`contactInfo.${index}.infoTitle`}
                        type="radio"
                        className="mr-2"
                        onChange={resumeFormFormik.handleChange}
                        value="Phone"
                        checked={contactInfo.infoTitle === "Phone"}
                    />
                    Phone
                </label>

                <label className="flex items-center mr-4 sm:text-sm">
                    <input
                        id={`contactInfo-${index}-infoTitle-location`}
                        name={`contactInfo.${index}.infoTitle`}
                        type="radio"
                        className="mr-2"
                        onChange={resumeFormFormik.handleChange}
                        value="Location"
                        checked={contactInfo.infoTitle === "Location"}
                    />
                    Location
                </label>

                <label className="flex items-center mr-4 sm:text-sm">
                    <input
                        id={`contactInfo-${index}-infoTitle-github`}
                        name={`contactInfo.${index}.infoTitle`}
                        type="radio"
                        className="mr-2"
                        onChange={resumeFormFormik.handleChange}
                        value="GitHub"
                        checked={contactInfo.infoTitle === "GitHub"}
                    />
                    GitHub
                </label>
            </div>

            <div
                className="flex items-center mb-1 bg-white"
                onMouseEnter={() => setIsIconVisible(true)}
                onMouseLeave={() => setIsIconVisible(false)}
            >
                {shouldShowLinkInput && (
                    <div className="bg-white flex-1 mr-2">
                        <input
                            id={`contactInfo-${index}-infoLink`}
                            name={`contactInfo.${index}.infoLink`}
                            type="url"
                            placeholder={contactInfo.infoTitle + " Url" || "Link"}
                            className={`${inputFieldClassName} font-normal`}
                            onChange={resumeFormFormik.handleChange}
                            value={contactInfo.infoLink || ""}
                        />
                    </div>
                )}

                {shouldShowInfoDetailsInput && (
                    <div className="bg-white flex-1 mr-2">
                        <input
                            id={`contactInfo-${index}-infoDetails`}
                            name={`contactInfo.${index}.infoDetails`}
                            type="text"
                            placeholder={contactInfo.infoTitle || "Details"}
                            className={`${inputFieldClassName} font-normal`}
                            onChange={resumeFormFormik.handleChange}
                            value={contactInfo.infoDetails || ""}
                        />
                    </div>
                )}

                {isIconVisible && contactInfoList.length > 1 && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-500 cursor-pointer mr-3"
                        onClick={removeContactInfo}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                    </svg>
                )}
            </div>
        </>
    );
};
