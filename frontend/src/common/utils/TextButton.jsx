import React from "react";
import PropTypes from "prop-types";

/**
 * A simple text-style button for navigation and actions.
 * Usage:
 * <TextButton onClick={...}>Label</TextButton>
 */
export default function TextButton({
  children,
  onClick,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`text-sm text-smiles-blue hover:underline ${className}`.trim()}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

TextButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.string,
};
