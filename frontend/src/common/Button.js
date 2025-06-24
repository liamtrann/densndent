
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
}) {
  const baseStyles =
    "px-5 py-2 rounded font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-400",
    secondary:
      "bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 focus:ring-orange-400",
    disabled:
      "bg-gray-300 text-gray-600 cursor-not-allowed",
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
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["primary", "secondary"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};