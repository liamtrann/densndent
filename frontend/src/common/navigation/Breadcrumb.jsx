// src/common/Breadcrumb.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ path }) {
  return (
    <div className="text-sm text-gray-600 mb-4">
      {path.map((segment, idx) => (
        <span key={idx}>
          {idx > 0 && " - "}
          {segment.link ? (
            <Link
              to={segment.link}
              className="hover:underline text-blue-600"
            >
              {segment.name}
            </Link>
          ) : (
            <span className="font-semibold">{segment.name}</span>
          )}
        </span>
      ))}
    </div>
  );
}
