// src/components/CenteredContent.js
export default function CenteredContent({ children }) {
    return (
        <div className="max-w-screen-2xl mx-auto px-4">
            {children}
        </div>
    );
}
