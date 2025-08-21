// src/common/ui/Dropdown.jsx
import React from "react";
import classNames from "classnames";

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  className = "",
  ...props
}) {
  return (
    <div className="mb-2">
      {label && (
        <label className="block mb-1 font-medium text-sm">{label}</label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={classNames(
          "border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-smiles-orange transition",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
