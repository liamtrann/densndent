/** @jsxRuntime classic */
// src/common/ui/PurchaseOptions.jsx
import React from "react";
import Dropdown from "../ui/Dropdown";

export default function PurchaseOptions({
  name, // e.g., `${id}-${flavor || 'no-flavor'}`
  isSubscribed, // boolean
  interval, // "1" | "2" | "3" | "6"
  onOneTime, // () => void
  onSubscribe, // () => void
  onIntervalChange, // (value: string) => void
  className = "",
}) {
  return (
    <fieldset className={`mt-3 ${className}`}>
      <legend className="sr-only">Purchase options</legend>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={`purchase-${name}`}
            checked={!isSubscribed}
            onChange={onOneTime}
            className="h-4 w-4"
          />
          <span>One-Time Purchase</span>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name={`purchase-${name}`}
            checked={isSubscribed}
            onChange={onSubscribe}
            className="h-4 w-4"
          />
          <span>Subscribe &amp; Save</span>
        </label>
      </div>

      {isSubscribed && (
        <div className="mt-2">
          <Dropdown
            label="Delivery frequency"
            id={`interval-${name}`}
            value={interval}
            onChange={(e) => onIntervalChange(e.target.value)}
            options={[
              { value: "1", label: "Every 1 month" },
              { value: "2", label: "Every 2 months" },
              { value: "3", label: "Every 3 months" },
              { value: "6", label: "Every 6 months" },
            ]}
            className="text-sm"
          />
        </div>
      )}
    </fieldset>
  );
}
