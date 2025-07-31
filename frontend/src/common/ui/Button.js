// src/common/Button.js
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
      "bg-smiles-blue text-white px-4 py-2 hover:bg-smiles-orange/80 dark:hover:bg-smiles-orange focus:ring-smiles-orange",
    secondary:
      "bg-white border border-smiles-orange text-smiles-orange px-4 py-2 hover:bg-smiles-orange/10 dark:bg-gray-800 dark:border-orange-300 focus:ring-smiles-orange",
    link:
      "text-smiles-blue bg-transparent hover:underline px-0 py-0 dark:text-blue-300 focus:ring-smiles-orange",
    danger:
      "bg-red-500 text-white px-4 py-2 hover:bg-red-600 focus:ring-red-400",
    disabled:
      "bg-gray-300 text-gray-600 cursor-not-allowed px-4 py-2 dark:bg-gray-700 dark:text-gray-500",
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
