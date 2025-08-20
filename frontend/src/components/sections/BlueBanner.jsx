// components/BlueBanner.jsx
import React, { useRef } from "react";

import { Button, Loading, ErrorMessage } from "common";

export default function BlueBanner({
  items = [], // Default to empty array
  columns = { base: 2, md: 4, lg: 5 },
  renderItem,
  showButton = true,
  buttonText = "",
  buttonOnClick = () => {},
  loading = false,
  error = null,
  enableHorizontalScroll = false, // New prop to enable horizontal scrolling
}) {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  // Ref for horizontal scroll container
  const scrollContainerRef = useRef(null);

  const gridClasses = `grid grid-cols-${columns.base} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg} gap-6`;

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <section className="bg-white px-6 py-8">
        {loading ? (
          <div className="col-span-full">
            <Loading text={`Loading...`} />
          </div>
        ) : error ? (
          <div className="col-span-full">
            <ErrorMessage message={error} />
          </div>
        ) : safeItems.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No items to display
          </div>
        ) : enableHorizontalScroll ? (
          // Horizontal scroll layout with navigation buttons
          <div className="relative">
            {/* Left scroll button */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200 md:block hidden"
              aria-label="Scroll left"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Scrollable container */}
            <div className="md:overflow-x-hidden">
              <div
                ref={scrollContainerRef}
                className="grid grid-cols-2 gap-4 md:flex md:gap-4 md:overflow-x-auto md:scrollbar-hide md:scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {safeItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="md:flex-shrink-0 md:w-64 shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    {renderItem(item)}
                  </div>
                ))}
              </div>
            </div>

            {/* Right scroll button */}
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200 md:block hidden"
              aria-label="Scroll right"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        ) : (
          // Grid layout (default)
          <div
            className={`${gridClasses} items-center justify-items-center text-center`}
          >
            {safeItems.map((item, idx) => (
              <div
                key={idx}
                className="shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                {renderItem(item)}
              </div>
            ))}
          </div>
        )}

        {buttonText && showButton && !loading && !error && (
          <div className="flex justify-center mt-4">
            <Button onClick={buttonOnClick}>{buttonText}</Button>
          </div>
        )}
      </section>
    </>
  );
}
