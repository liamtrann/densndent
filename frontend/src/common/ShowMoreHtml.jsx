import React from "react";

export default function ShowMoreHtml({ html, maxLength = 400 }) {
    const [expanded, setExpanded] = React.useState(false);
    // Remove HTML tags for length calculation
    const plainText = html.replace(/<[^>]+>/g, "");
    const isLong = plainText.length > maxLength;
    return (
        <div className="text-gray-700 text-base mt-4">
            {isLong && !expanded ? (
                <span>{plainText.slice(0, maxLength)}... </span>
            ) : (
                <span dangerouslySetInnerHTML={{ __html: html }} />
            )}
            {isLong && (
                <button
                    className="ml-2 text-sm text-blue-600 underline focus:outline-none"
                    onClick={() => setExpanded((v) => !v)}
                >
                    {expanded ? "Show less" : "Show more"}
                </button>
            )}
        </div>
    );
}
