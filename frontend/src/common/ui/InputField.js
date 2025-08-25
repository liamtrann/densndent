import classNames from "classnames";

/**
 * Generic input with a few extras:
 * - size: "sm" | "md" | "lg" (controls height/padding)
 * - align: "left" | "center" | "right"
 * - wrapperClassName: style the outer wrapper (defaults to mb-2)
 * - variant: "default" (with borders/ring) | "unstyled" (use your own classes)
 */
export default function InputField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  wrapperClassName = "mb-2",
  checked,
  error,
  size = "md",
  align = "left",
  variant = "default",
  ...props
}) {
  const isCheckbox = type === "checkbox";

  const sizeClasses =
    size === "sm"
      ? "h-8 px-2 py-1 text-sm"
      : size === "lg"
      ? "h-12 px-4 py-3 text-lg"
      : "h-10 px-3 py-2"; // md

  const alignClasses =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "";

  const baseDefault =
    "border rounded w-full focus:outline-none focus:ring-2 transition";

  return (
    <div className={isCheckbox ? "mb-2" : wrapperClassName}>
      {isCheckbox ? (
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="mr-2"
            {...props}
          />
          {label}
        </label>
      ) : (
        <>
          {label && (
            <label className="block mb-1 font-medium text-sm">{label}</label>
          )}

          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={classNames(
              variant === "default"
                ? classNames(
                    baseDefault,
                    error
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-smiles-orange",
                    sizeClasses,
                    alignClasses
                  )
                : classNames( // "unstyled": use exactly what caller provides
                    sizeClasses,
                    alignClasses
                  ),
              className
            )}
            {...props}
          />

          {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
        </>
      )}
    </div>
  );
}
