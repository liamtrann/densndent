// components/Button.js
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
    "text-sm font-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-smiles-blue text-white px-1 py-1 rounded hover:bg-smiles-orange/80 focus:ring-smiles-orange",
    secondary:
      "bg-white blue border-smiles-orange text-smiles-orange px-4 py-2 rounded hover:bg-smiles-orange/10 focus:ring-smiles-orange",
    link:
      "text-smiles-blue bg-transparent hover:underline p-0 focus:ring-smiles-orange",
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