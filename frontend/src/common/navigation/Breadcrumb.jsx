// src/common/Breadcrumb.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ path }) {
  return (
    <div className="text-sm text-gray-600 mb-4">
      {path.map((segment, idx) => (
        <span key={idx}>
          {idx > 0 && " - "}
          {idx === path.length - 1 ? (
            <span className="font-semibold">{segment}</span>
          ) : (
            <span className="text-gray-600">{segment}</span>
          )}
        </span>
      ))}
    </div>
  );
}
