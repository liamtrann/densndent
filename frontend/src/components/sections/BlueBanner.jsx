import React, { useRef } from "react";
import { Button, Loading, ErrorMessage } from "common";

export default function BlueBanner({
  items = [],
  columns = { base: 2, md: 4, lg: 5 },
  renderItem,
  showButton = true,
  buttonText = "",
  buttonOnClick = () => {},
  loading = false,
  error = null,
  enableHorizontalScroll = false,
  showScrollBar = false, // ← use this to control visibility
}) {
  const safeItems = Array.isArray(items) ? items : [];
  const scrollContainerRef = useRef(null);

  const gridClasses = `grid grid-cols-${columns.base} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg} gap-6`;

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  // Classes/styles for the horizontal scroller
  const scrollerClasses = [
    "grid grid-cols-2 gap-4 md:flex md:gap-4 md:overflow-x-auto md:scroll-smooth",
    showScrollBar ? "md:pb-2" : "md:scrollbar-hide", // show OR hide
  ].join(" ");

  const scrollerStyle = showScrollBar
    ? undefined
    : { scrollbarWidth: "none", msOverflowStyle: "none" }; // Firefox/IE hide

  return (
    <section className="bg-white px-6 py-8">
      {loading ? (
        <div className="col-span-full">
          <Loading text="Loading..." />
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
        <div className="relative">
          {/* Left button */}
          <button
            onClick={scrollLeft}
            className="absolute -left-8 top-1/2 -translate-y-1/2 z-10 bg-[#005687] shadow-lg rounded-full p-2 hover:bg-[#004D79] transition-colors duration-200 md:block hidden"
            aria-label="Scroll left"
          >
            <svg
              className="w-5 h-5 text-white"
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

          {/* Scrollable row; when showScrollBar=true the native bar is visible at the bottom */}
          <div className="md:overflow-x-visible">
            {" "}
            {/* ensure the native bar can show */}
            <div
              ref={scrollContainerRef}
              className={scrollerClasses}
              style={scrollerStyle}
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

          {/* Right button */}
          <button
            onClick={scrollRight}
            className="absolute -right-9 top-1/2 -translate-y-1/2 z-10 bg-[#005687] shadow-lg rounded-full p-2 hover:bg-[#004D79] transition-colors duration-200 md:block hidden"
            aria-label="Scroll right"
          >
            <svg
              className="w-5 h-5 text-white"
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
  );
}
