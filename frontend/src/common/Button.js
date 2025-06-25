// components/Button.js
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) {
  const baseStyles =
    "font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-smiles-orange text-white px-4 py-2 rounded hover:bg-smiles-orange/80 focus:ring-smiles-orange",
    secondary:
      "bg-white border border-smiles-orange text-smiles-orange px-4 py-2 rounded hover:bg-smiles-orange/10 focus:ring-smiles-orange",
    link:
      "text-smiles-orange bg-transparent hover:underline p-0 focus:ring-smiles-orange",
    disabled:
      "bg-gray-300 text-gray-600 cursor-not-allowed px-4 py-2 rounded",
  };

  const finalClassName = classNames(
    baseStyles,
    disabled ? variants["disabled"] : variants[variant],
    className
  );

  return (
    <button
      type={type}
      className={finalClassName}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["primary", "secondary", "link"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};