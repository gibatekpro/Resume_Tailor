import React from "react";

interface SectionHeaderProps {
    title: string;
    addToSection?: () => void;
    removeSection?: () => void;
    pasteItem?: () => void;
    clearField?: () => void;
    hasAddIcon: boolean;
    hasDeleteIcon: boolean;
    hasPasteIcon: boolean;
    hasClearIcon: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
                                                                title,
                                                                addToSection,
                                                                removeSection,
                                                                hasAddIcon,
                                                                hasDeleteIcon,
                                                                hasPasteIcon,
                                                                pasteItem,
                                                                clearField,
                                                                hasClearIcon,
                                                            }) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">{title}</span>

            <div className="flex items-center">
                {hasAddIcon &&
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-500 cursor-pointer mr-2"
                        onClick={addToSection}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                }
                {hasDeleteIcon &&
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-500 cursor-pointer"
                        onClick={removeSection}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                    </svg>
                }
                {hasPasteIcon &&
                    <button
                        type="button"
                        className={""}
                        onClick={pasteItem}
                        title="Paste"
                        aria-label="Paste"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 text-gray-500 cursor-pointer"
                        >
                            <path fillRule="evenodd"
                                  d="M15.988 3.012A2.25 2.25 0 0 1 18 5.25v6.5A2.25 2.25 0 0 1 15.75 14H13.5V7A2.5 2.5 0 0 0 11 4.5H8.128a2.252 2.252 0 0 1 1.884-1.488A2.25 2.25 0 0 1 12.25 1h1.5a2.25 2.25 0 0 1 2.238 2.012ZM11.5 3.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v.25h-3v-.25Z"
                                  clipRule="evenodd"/>
                            <path fillRule="evenodd"
                                  d="M2 7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7Zm2 3.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm0 3.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z"
                                  clipRule="evenodd"/>
                        </svg>
                    </button>
                }

                {hasClearIcon &&
                    <button
                        type="button"
                        className={"ml-3.5"}
                        onClick={clearField}
                        title="Clear this field" // Ensures the correct hint is displayed
                        aria-label="Clear this field" // Improves accessibility
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                             className="size-5">
                            <path
                                d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"/>
                        </svg>

                    </button>

                }
            </div>
        </div>
    );
};