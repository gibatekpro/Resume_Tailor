import React from "react";
import { Button } from "react-bootstrap";

interface CustomAccordionProps {
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CustomAccordion: React.FC<CustomAccordionProps> = ({ children }) => {
    return (
        <div className="overflow-hidden rounded-lg border border-[#c6c6cd] bg-[#f9fbff] shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
            <div className="bg-white p-4 transition-all duration-300">{children}</div>
        </div>
    );
};
