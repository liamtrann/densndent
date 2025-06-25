import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames"; //
// common/InputField.js
export default function InputField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  ...props
}) {
  return (
    <div className="mb-2">
      {label && <label className="block mb-1 font-medium text-sm">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={classNames(
          "border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-smiles-orange transition",
          className
        )}
        {...props}
      />
    </div>
  );
}
