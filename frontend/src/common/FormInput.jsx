import React from "react";

export default function FormInput({
  label,
  required = false,
  placeholder = "",
  type = "text",
  ...props
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">
        {label} {required && "*"}
      </label>
      <input
        type={type}
        className="w-full border p-2 rounded"
        placeholder={placeholder}
        required={required}
        {...props}
      />
    </div>
  );
}
