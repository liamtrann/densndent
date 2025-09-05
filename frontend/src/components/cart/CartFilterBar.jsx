// src/components/cart/CartFilterBar.jsx
import React from "react";
import { Dropdown } from "common";

export default function CartFilterBar({ value, onChange, className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm font-medium">Show</span>
      <div className="w-56">
        <Dropdown
          value={value}
          onChange={(e) => onChange(e.target.value)}
          options={[
            { value: "all", label: "All items" },
            { value: "sub", label: "Subscriptions" },
            { value: "one", label: "One-time purchases" },
          ]}
        />
      </div>
    </div>
  );
}
