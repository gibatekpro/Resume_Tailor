import React, { useState } from "react";

type CustomAccordionProps = {
    title: string; // The header of the accordion
    children: React.ReactNode; // Content inside the accordion body
    isOpenDefault?: boolean; // Optional: Start with the accordion open
};

export const CustomAccordionStyleB: React.FC<CustomAccordionProps> = ({
                                                                    title,
                                                                    children,
                                                                    isOpenDefault = false,
                                                                }) => {
    const [isOpen, setIsOpen] = useState(isOpenDefault);

    const toggleAccordion = () => setIsOpen(!isOpen);

    return (
        <div className={"cursor-pointer"} style={styles.accordionContainer}>
            {/* Accordion Header */}
            <div style={styles.accordionHeader} onClick={toggleAccordion}>
                <span>{title}</span>
                <span>{isOpen ? "-" : "+"}</span>
            </div>

            {/* Accordion Body */}
            {isOpen && <div style={styles.accordionBody}>{children}</div>}
        </div>
    );
};

// Inline styles for the accordion
const styles = {
    accordionContainer: {
        border: "1px solid lightgray",
        borderRadius: 4,
        marginBottom: 10,
        overflow: "hidden",
    },
    accordionHeader: {
        backgroundColor: "#f8f9fa",
        padding: 10,
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
    },
    accordionBody: {
        padding: 10,
        backgroundColor: "white",
    },
};
