// components/BlueBanner.jsx
import React from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";
import { SectionTitle } from '../common';

export default function BlueBanner({
  title,
  items,
  columns = { base: 2, md: 4, lg: 5 },
  renderItem,
  showButton = true,
  buttonText = "Shop All",
  buttonOnClick = () => {},
}) {
  const gridClasses = `grid grid-cols-${columns.base} md:grid-cols-${columns.md} lg:grid-cols-${columns.lg} gap-6`;

  return (
    <>
      <SectionTitle>{title}</SectionTitle>
      <section className={`bg-white px-6 py-8 ${gridClasses} items-center justify-items-center text-center`}>
        {items.map((item, idx) => (
          <div key={idx}>
            {renderItem(item)}
          </div>
        ))}

        {showButton && (
          <div className="col-span-full flex justify-center mt-4">
            <Button onClick={buttonOnClick}>{buttonText}</Button>
          </div>
        )}
      </section>
    </>
  );
}
