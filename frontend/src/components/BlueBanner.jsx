// components/BlueBanner.jsx
import React from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";

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
      <section className="bg-smiles-blue text-white text-center py-4">
        <h2 className="text-2xl font-bold">{title}</h2>
      </section>
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

BlueBanner.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  columns: PropTypes.shape({
    base: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
  }),
  renderItem: PropTypes.func.isRequired,
  showButton: PropTypes.bool,
  buttonText: PropTypes.string,
  buttonOnClick: PropTypes.func,
};
