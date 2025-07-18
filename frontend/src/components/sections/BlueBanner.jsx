// components/BlueBanner.jsx
import React, { useRef, useState, useEffect } from "react";
import { Button, SectionTitle, Loading, ErrorMessage } from "common";

// Add CSS to hide scrollbar
const hideScrollbarStyle = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// Inject the style into the document head
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = hideScrollbarStyle;
  if (!document.head.querySelector("style[data-hide-scrollbar]")) {
    styleElement.setAttribute("data-hide-scrollbar", "true");
    document.head.appendChild(styleElement);
  }
}

// Simple scroll arrows
function ScrollArrow({ direction, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`hidden md:flex p-2 mx-2 rounded-full shadow-md transition-all duration-200 z-10 items-center justify-center ${
        disabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
          : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg"
      }`}
      style={{ minWidth: "40px", height: "40px" }}
      aria-label={`Scroll ${direction}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        {direction === "left" ? (
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        ) : (
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        )}
      </svg>
    </button>
  );
}

export default function BlueBanner({
  title,
  items,
  columns = { base: 2, md: 4, lg: 5 },
  renderItem,
  showButton = true,
  buttonText = "",
  buttonOnClick = () => {},
  loading = false,
  error = null,
  enableHorizontalScroll = false, // New prop to enable horizontal scrolling
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      // Only allow arrow scrolling on desktop screens
      const isMobile = window.innerWidth < 768;
      if (isMobile) return; // Disable arrow scrolling on mobile

      container.scrollBy({
        left: -800,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      // Only allow arrow scrolling on desktop screens
      const isMobile = window.innerWidth < 768;
      if (isMobile) return; // Disable arrow scrolling on mobile

      container.scrollBy({
        left: 800,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (enableHorizontalScroll) {
      updateScrollButtons();

      const container = scrollContainerRef.current;
      if (container) {
        const handleScroll = () => updateScrollButtons();
        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
      }
    }
  }, [items, enableHorizontalScroll]);

  const gridClasses = `grid grid-cols-${columns.base} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg} gap-6`;

  return (
    <>
      <SectionTitle>{title}</SectionTitle>
      <section className="bg-white px-6 py-8">
        {loading ? (
          <div className="col-span-full">
            <Loading text={`Loading ${title.toLowerCase()}...`} />
          </div>
        ) : error ? (
          <div className="col-span-full">
            <ErrorMessage message={error} />
          </div>
        ) : enableHorizontalScroll ? (
          <>
            {/* Desktop horizontal scroll layout */}
            <div className="relative hidden md:block">
              <div className="flex items-center">
                <ScrollArrow
                  direction="left"
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                />

                <div
                  ref={scrollContainerRef}
                  className="flex overflow-x-auto gap-4 pb-4 flex-1 items-center justify-center hide-scrollbar"
                  style={{
                    scrollbarWidth: "none", // Firefox
                    msOverflowStyle: "none", // IE and Edge
                    overscrollBehavior: "contain",
                  }}
                  onScroll={updateScrollButtons}
                >
                  {items.map((item, idx) => (
                    <div key={idx} className="flex-shrink-0">
                      {renderItem(item)}
                    </div>
                  ))}
                </div>

                <ScrollArrow
                  direction="right"
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                />
              </div>
            </div>

            {/* Mobile grid layout */}
            <div className="md:hidden">
              <div
                className={`${gridClasses} items-center justify-items-center text-center`}
              >
                {items.map((item, idx) => (
                  <div key={idx}>{renderItem(item)}</div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Grid layout (default)
          <div
            className={`${gridClasses} items-center justify-items-center text-center`}
          >
            {items.map((item, idx) => (
              <div key={idx}>{renderItem(item)}</div>
            ))}
          </div>
        )}

        {showButton && !loading && !error && (
          <div className="flex justify-center mt-4">
            <Button onClick={buttonOnClick}>{buttonText}</Button>
          </div>
        )}
      </section>
    </>
  );
}
