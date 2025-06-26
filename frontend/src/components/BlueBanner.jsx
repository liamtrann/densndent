// components/BlueBanner.jsx
import React from "react";
import Button from "../common/Button";
import { SectionTitle, Loading, ErrorMessage } from '../common';

export default function BlueBanner({
  title,
  items,
  columns = { base: 2, md: 4, lg: 5 },
  renderItem,
  showButton = true,
  buttonText = "Shop All",
  buttonOnClick = () => {},
  loading = false,
  error = null,
}) {
  const gridClasses = `grid grid-cols-${columns.base} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg} gap-6`;

  return (
    <>
      <SectionTitle>{title}</SectionTitle>
      <section className={`bg-white px-6 py-8 ${gridClasses} items-center justify-items-center text-center`}>
        {loading ? (
          <div className="col-span-full"><Loading text={`Loading ${title.toLowerCase()}...`} /></div>
        ) : error ? (
          <div className="col-span-full"><ErrorMessage message={error} /></div>
        ) : (
          items.map((item, idx) => (
            <div key={idx}>
              {renderItem(item)}
            </div>
          ))
        )}

        {showButton && !loading && !error && (
          <div className="col-span-full flex justify-center mt-4">
            <Button onClick={buttonOnClick}>{buttonText}</Button>
          </div>
        )}
      </section>
    </>
  );
}
