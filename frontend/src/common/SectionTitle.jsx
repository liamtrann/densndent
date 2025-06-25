import React from "react";
import PropTypes from "prop-types";

export default function SectionTitle({ children, className = "" }) {
  return (
    <section className={`bg-smiles-blue text-white text-center py-4 ${className}`}>
      <h2 className="text-2xl font-bold">{children}</h2>
    </section>
  );
}

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
