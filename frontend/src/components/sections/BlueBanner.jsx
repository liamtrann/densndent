// components/BlueBanner.jsx
import React from "react";
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

  const gridClasses = `grid grid-cols-${columns.base} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg} gap-6`;

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
          // Horizontal scroll layout - grid on mobile, horizontal scroll on md+
          <div className="md:overflow-x-auto md:scrollbar-hide">
            <div className="grid grid-cols-2 gap-4 md:flex md:gap-4 md:pb-4">
              {safeItems.map((item, idx) => (
                <div
                  key={idx}
                  className="md:flex-shrink-0 shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  {renderItem(item)}
                </div>
              ))}
            </div>
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

        {showButton && !loading && !error && (
          <div className="flex justify-center mt-4">
            <Button onClick={buttonOnClick}>{buttonText}</Button>
          </div>
        )}
      </section>
    </>
  );
}
