// src/components/CenteredContent.js
import React from "react";

export default function CenteredContent({ children }) {
    return (
        <div className="max-w-screen-2xl mx-auto px-4">
            {children}
        </div>
    );
}
