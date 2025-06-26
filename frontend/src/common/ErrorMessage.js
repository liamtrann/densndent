import React from "react";

export default function ErrorMessage({ message = "An error occurred." }) {
    return (
        <div className="w-full flex items-center justify-center py-8">
            <span className="text-red-600 font-medium bg-red-50 border border-red-200 px-4 py-2 rounded">
                {message}
            </span>
        </div>
    );
}
