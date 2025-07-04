import React from "react";

export default function FormSelect({ label, required = false, options = [], ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">
        {label} {required && "*"}
      </label>
      <select className="w-full border p-2 rounded" required={required} {...props}>
        <option value="">-- Select --</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
