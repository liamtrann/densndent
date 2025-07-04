import React from "react";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";


export default function AddressModal({ onClose }) {
  const states = [
    { label: "California", value: "CA" },
    { label: "New York", value: "NY" },
    { label: "Texas", value: "TX" },
    // Add more as needed
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Add New Address</h2>

        <form>
          <FormInput label="Full Name" required />
          <FormInput label="Address" required placeholder="1234 Main Street" />
          <FormInput label="Address 2" placeholder="Apt. 3 or Suite #1516" />
          <FormInput label="City" required />
          <FormSelect label="State" required options={states} />
          <FormInput label="Zip Code" required placeholder="94117" />
          <FormInput label="Phone Number" required placeholder="555-123-1234" />

          <div className="mb-4 space-y-2 text-sm">
            <label><input type="checkbox" className="mr-1" /> This is a Residential Address</label><br />
            <label><input type="checkbox" className="mr-1" /> Make this my default billing address</label><br />
            <label><input type="checkbox" className="mr-1" /> Make this my default shipping address</label>
          </div>

          <div className="flex justify-end gap-3">
            <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded">Save Address</button>
            <button type="button" onClick={onClose} className="bg-gray-700 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
