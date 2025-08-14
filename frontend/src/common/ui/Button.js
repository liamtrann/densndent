import classNames from "classnames";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",  // primary | secondary | link | danger | dangerGhost | disabled
  size = "md",          // sm | md | lg
  className = "",
  disabled = false,
  ...props
}) {
  // keep base lightweight; sizing handled separately so we can make small buttons
  const base =
    "inline-flex items-center justify-center font-medium rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  // sizes override any px/py coming from variants (sizes are appended last)
  const sizes = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-3",
  };

  const variants = {
    primary:
      "bg-smiles-blue text-white hover:bg-smiles-orange/80 dark:hover:bg-smiles-orange focus:ring-smiles-orange",
    secondary:
      "bg-white border border-smiles-orange text-smiles-orange hover:bg-smiles-orange/10 dark:bg-gray-800 dark:border-orange-300 focus:ring-smiles-orange",
    link:
      "bg-transparent text-smiles-blue underline focus:ring-smiles-orange px-0 py-0",
    danger:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
    // NEW: light, outlined red—great for a subtle 'Cancel subscription'
    dangerGhost:
      "bg-white border border-red-300 text-red-600 hover:bg-red-50 focus:ring-red-300",
    disabled:
      "bg-gray-300 text-gray-600 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500",
  };

  const finalClassName = classNames(
    base,
    disabled ? variants.disabled : variants[variant],
    sizes[size],
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
