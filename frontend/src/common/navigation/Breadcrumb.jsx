import React from "react";

export default function Breadcrumb({ path }) {
  return (
    <div className="text-sm text-gray-600 mb-4">
      {path.map((segment, idx) => (
        <span key={idx}>
          {idx > 0 && " - "}
          <span className={idx === path.length - 1 ? "font-semibold" : ""}>
            {segment}
          </span>
        </span>
      ))}
    </div>
  );
}
