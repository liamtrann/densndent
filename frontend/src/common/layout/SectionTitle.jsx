import React from "react";

export default function SectionTitle({ children, className = "" }) {
  return (
    <section
      className={`bg-smiles-blue text-white text-center py-4 ${className}`}
    >
      <h2 className="text-2xl font-bold">{children}</h2>
    </section>
  );
}
