import React from "react";

type PaginationControlsProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    label?: string;
};

export const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    label = "Items",
}) => {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div
            style={{
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                borderTop: "1px solid #e9edf5",
                paddingTop: "10px",
            }}
        >
            <button
                type="button"
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage <= 1}
                className="cursor-pointer rounded-md border border-[#d4d9e5] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#4a4e57] transition-all duration-200 hover:border-[#bfd5ff] disabled:cursor-not-allowed disabled:opacity-45"
            >
                Prev
            </button>

            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6370]">
                {label} page {currentPage} of {totalPages}
            </span>

            <button
                type="button"
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="cursor-pointer rounded-md border border-[#d4d9e5] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#4a4e57] transition-all duration-200 hover:border-[#bfd5ff] disabled:cursor-not-allowed disabled:opacity-45"
            >
                Next
            </button>
        </div>
    );
};

export default PaginationControls;
