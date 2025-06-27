import React from "react";
import { Link } from "react-router-dom";
import Paragraph from "../common/Paragraph";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
            <Paragraph className="text-xl text-gray-700 mb-2">Page Not Found</Paragraph>
            <Paragraph className="text-gray-500 mb-6">
                Sorry, the page you are looking for does not exist or has been moved.
            </Paragraph>
            <Link
                to="/"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Go Home
            </Link>
        </div>
    );
}
