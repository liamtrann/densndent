import React from "react";

function PaginationButton({ children, active, ...props }) {
    return (
        <button
            {...props}
            className={`px-2 py-1 border rounded ${active ? "bg-blue-500 text-white" : ""
                } ${props.className || ""}`.trim()}
        >
            {children}
        </button>
    );
}

export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const handlePrev = () => onPageChange(Math.max(1, page - 1));
    const handleNext = () => onPageChange(Math.min(totalPages, page + 1));
    const handlePageClick = (p) => onPageChange(p);

    // Pagination window logic
    const windowSize = 6;
    let start = Math.floor((page - 1) / windowSize) * windowSize + 1;
    let end = Math.min(start + windowSize - 1, totalPages);

    // If at the end, show the last windowSize pages
    if (end - start + 1 < windowSize && totalPages >= windowSize) {
        start = Math.max(1, end - windowSize + 1);
    }

    const pageNumbers = [];
    for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex justify-center items-center gap-2 my-4">
            <PaginationButton onClick={handlePrev} disabled={page === 1}>
                Prev
            </PaginationButton>
            {start > 1 && <span className="px-2">...</span>}
            {pageNumbers.map(i => (
                <PaginationButton
                    key={i}
                    onClick={() => handlePageClick(i)}
                    active={page === i}
                >
                    {i}
                </PaginationButton>
            ))}
            {end < totalPages && <span className="px-2">...</span>}
            <PaginationButton onClick={handleNext} disabled={page === totalPages}>
                Next
            </PaginationButton>
        </div>
    );
}
