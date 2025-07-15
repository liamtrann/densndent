import React from "react";

export default function ErrorMessage({ message = "An error occurred." }) {
    return (
        <div className="w-full flex items-center justify-center py-8">
            <span className="text-red-700 font-semibold bg-red-100 px-6 py-3 rounded-lg shadow-sm animate-pulse">
                {message}
            </span>
        </div>
    );
}
