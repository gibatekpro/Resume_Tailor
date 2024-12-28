import React, { useState } from "react";

type CustomAccordionProps = {
    title: string;
    children?: React.ReactNode;
    isOpenDefault?: boolean;
};

export const CustomAccordionStyleB: React.FC<CustomAccordionProps & {
    items: any[];
    onSelectItem: (item: any) => void;
    onDeleteItem: (item: any) => void;
    selectedItem?: any;
}> = ({
          title,
          items,
          onSelectItem,
          onDeleteItem,
          selectedItem,
          isOpenDefault = false,
      }) => {
    const [isOpen, setIsOpen] = useState(isOpenDefault);

    const toggleAccordion = () => setIsOpen(!isOpen);

    return (
        <div className="cursor-pointer" style={styles.accordionContainer}>
            {/* Accordion Header */}
            <div style={styles.accordionHeader} onClick={toggleAccordion}>
                <span>{title}</span>
                <span>{isOpen ? "-" : "+"}</span>
            </div>

            {/* Accordion Body */}
            {isOpen && (
                <div style={styles.accordionBody}>
                    {items.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => onSelectItem(item)}
                            style={{
                                padding: 5,
                                borderBottom: "1px solid lightgray",
                                fontSize: 14,
                                backgroundColor:
                                    selectedItem === item ? "gray" : "transparent",
                                color:
                                    selectedItem === item ? "white" : "black",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <span>{`${item.data.openAIJobTitle} - ${item.data.openAIJobCompanyName}`}</span>
                            {/* Trash Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-trash3"
                                viewBox="0 0 16 16"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering the row's onClick
                                    onDeleteItem(item);
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                        </div>
                    ))}
                </div>
            )}
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
