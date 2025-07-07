import React, { useState } from "react";
import InputField from "./InputField";
import Dropdown from "./Dropdown";
import Button from "./Button";

export default function AddressModal({ onClose }) {
  const states = [
    { value: "California", label: "California" },
    { value: "New York", label: "New York" },
    { value: "Texas", label: "Texas" }
  ];


  // Example checkbox state (optional: convert to full form state if needed)
  const [residential, setResidential] = useState(false);
  const [defaultBilling, setDefaultBilling] = useState(false);
  const [defaultShipping, setDefaultShipping] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Add New Address</h2>

        <form>
          <InputField label="Full Name" required />
          <InputField label="Address" required placeholder="1234 Main Street" />
          <InputField label="Address 2" placeholder="Apt. 3 or Suite #1516" />
          <InputField label="City" required />
          <Dropdown label="State" options={states} required />
          <InputField label="Zip Code" required placeholder="94117" />
          <InputField label="Phone Number" required placeholder="555-123-1234" />

          {/* Reused InputField for checkboxes */}
          <InputField
            type="checkbox"
            label="This is a Residential Address"
            checked={residential}
            onChange={(e) => setResidential(e.target.checked)}
          />
          <InputField
            type="checkbox"
            label="Make this my default billing address"
            checked={defaultBilling}
            onChange={(e) => setDefaultBilling(e.target.checked)}
          />
          <InputField
            type="checkbox"
            label="Make this my default shipping address"
            checked={defaultShipping}
            onChange={(e) => setDefaultShipping(e.target.checked)}
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button type="submit">Save Address</Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
