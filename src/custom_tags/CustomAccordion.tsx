import React from "react";
import { Button } from "react-bootstrap";

interface CustomAccordionProps {
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CustomAccordion: React.FC<CustomAccordionProps> = ({ isOpen, setIsOpen, children }) => {
    return (
        <div className="mx-2 p-0 border-1 border-blue-500 rounded-lg mt-4">
            <Button
                type="button"
                className="w-full mt-0 bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <>
                        <span>Hide Form</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 15.75l7.5-7.5 7.5 7.5"
                            />
                        </svg>
                    </>
                ) : (
                    <>
                        <span>Show Form</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                        </svg>
                    </>
                )}
            </Button>
            {isOpen && <div className="mt-0 mb-4">{children}</div>}
        </div>
    );
};
