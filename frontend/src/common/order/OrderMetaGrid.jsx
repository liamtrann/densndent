// src/common/order/OrderMetaGrid.jsx
import React from "react";

export default function OrderMetaGrid({ items = [], className = "" }) {
  return (
    <div className={`bg-white border rounded shadow-sm p-5 mb-6 ${className}`}>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map(({ label, value }, i) => (
          <div key={i} className="text-sm">
            <div className="text-gray-500">{label}</div>
            <div className="font-medium text-gray-900">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
