import React from "react";

export default function Paragraph({ children, className = "" }) {
  return <p className={`text-gray-700 ${className}`}>{children}</p>;
}
