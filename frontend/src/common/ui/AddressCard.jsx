import React from "react";

export default function AddressCard({
  address,
  isSelected,
  onSelect,
  onRemove,
}) {
  return (
    <div
      className={`border rounded shadow-sm p-4 bg-white ${
        isSelected ? "ring-2 ring-green-500" : ""
      }`}
    >
      {isSelected && (
        <div className="text-sm font-semibold text-green-700 mb-1">
          ✓ Selected
        </div>
      )}
      <div className="space-y-1 text-sm">
        <div className="font-semibold">{address.fullName}</div>
        <div>{address.address}</div>
        <div>
          {[address.city, address.state, address.zip]
            .filter(Boolean)
            .join(", ")}
        </div>
        <div>{address.country}</div>
        <div className="text-blue-700">{address.phone}</div>
      </div>
      <div className="flex gap-4 mt-2 text-sm text-blue-700 underline">
        <button onClick={onSelect}>Select</button>
        <button onClick={onRemove}>Remove</button>
      </div>
    </div>
  );
}
