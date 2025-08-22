import classNames from "classnames";

export default function InputField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  checked,
  error,
  // NEW:
  wrapperClassName = "mb-2",
  bare = false,
  ...props
}) {
  const isCheckbox = type === "checkbox";

  // Bare mode: render just the input (no wrapper/label/margins)
  if (bare && !isCheckbox) {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={classNames(
          "border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 transition",
          error ? "border-red-500 focus:ring-red-400" : "focus:ring-smiles-orange",
          // hide spinners on number inputs (Firefox + WebKit)
          "appearance-none [appearance:textfield] [-moz-appearance:textfield]",
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div className={wrapperClassName}>
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
              "border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 transition",
              error
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-smiles-orange",
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
