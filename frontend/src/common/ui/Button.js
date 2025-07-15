// src/common/Button.js
import React from "react";
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
    "text-sm font-medium transition duration-200 rounded focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-smiles-blue text-white px-4 py-2 hover:bg-smiles-orange/80 focus:ring-smiles-orange",
    secondary:
      "bg-white border border-smiles-orange text-smiles-orange px-4 py-2 hover:bg-smiles-orange/10 focus:ring-smiles-orange",
    link:
      "text-smiles-blue bg-transparent hover:underline px-0 py-0 focus:ring-smiles-orange",
    danger:
      "bg-red-500 text-white px-4 py-2 hover:bg-red-600 focus:ring-red-400",
    disabled:
      "bg-gray-300 text-gray-600 cursor-not-allowed px-4 py-2",
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
