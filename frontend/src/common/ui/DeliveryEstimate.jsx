import React from "react";

const DeliveryEstimate = ({
  inStock,
  size = "default",
  showIcon = true,
  className = "",
}) => {
  const sizeClasses = {
    small: "text-xs px-2 py-0.5",
    default: "text-sm px-3 py-2",
    large: "text-base px-4 py-3",
  };

  const baseClasses = `mt-1 rounded-md ${sizeClasses[size]} ${className}`;

  if (inStock) {
    return (
      <p
        className={`${baseClasses} text-smiles-blue`}
      >
        {showIcon && "📦 "}Estimated delivery: 1-2 days
      </p>
    );
  }

  return (
    <p
      className={`${baseClasses} text-smiles-orange`}
    >
      {showIcon && "📦 "}Estimated delivery: 5-7 days
    </p>
  );
};

export default DeliveryEstimate;
