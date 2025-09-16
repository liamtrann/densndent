// Breadcrumb.jsx
import { useNavigate } from "react-router-dom";

export default function Breadcrumb({ path, className = "" }) {
  const navigate = useNavigate();

  const getUrl = (segment) => {
    if (segment.toLowerCase() === "home") {
      return "/";
    }
    return "/" + segment.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <nav
      className={`flex items-center space-x-1 text-sm mb-6 ${className}`}
      aria-label="Breadcrumb"
    >
      <div className="flex items-center space-x-1">
        {path.map((segment, idx) => (
          <div key={idx} className="flex items-center">
            {/* Separator */}
            {idx > 0 && (
              <svg
                className="w-4 h-4 mx-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}

            {/* Breadcrumb Item */}
            {idx === path.length - 1 ? (
              // Current page - not clickable
              <span className="px-3 py-1.5 text-gray-700 font-medium bg-gray-100 rounded-md">
                {segment}
              </span>
            ) : (
              // Clickable breadcrumb
              <button
                onClick={() => navigate(getUrl(segment))}
                className="px-3 py-1.5 text-gray-600 hover:text-smiles-orange hover:bg-orange-50 
                          rounded-md transition-all duration-200 focus:outline-none focus:ring-2 
                          focus:ring-smiles-orange focus:ring-opacity-50"
                aria-label={`Navigate to ${segment}`}
              >
                {idx === 0 && segment.toLowerCase() === "home" ? (
                  // Home icon for first item
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span>{segment}</span>
                  </div>
                ) : (
                  segment
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
