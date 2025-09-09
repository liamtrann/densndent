import React from "react";

export default function FlexibleModal({
  title,
  onClose,
  children,
  maxWidth = "max-w-4xl",
  maxHeight = "max-h-[90vh]",
}) {
  const handleBackdropClick = (e) => {
    // Only close if the click is on the backdrop itself, not on the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl ${maxWidth} w-full ${maxHeight} overflow-hidden transform transition-all duration-300 ease-out animate-slideUp`}
      >
        {/* Header with close button */}
        <div className="sticky top-0 bg-gradient-to-r from-white to-gray-50 border-b border-gray-100 px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto bg-gradient-to-b from-white to-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
}
