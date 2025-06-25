import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function InputField({
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  ...props
}) {
  return (
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
  );
}

InputField.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
}; 