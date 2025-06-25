// src/common/Dropdown.jsx
import React from "react";

export default function Dropdown({ label, options, value, onChange }) {
  return (
    <div className="mt-4">
      <label className="block mb-1 font-medium">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="border px-2 py-1 w-full rounded"
      >
        <option value="">- Select -</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
