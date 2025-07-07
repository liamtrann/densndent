// src/common/CreateAddressModal.jsx
import React, { useState } from "react";
import InputField from "./InputField";
import Dropdown from "./Dropdown";
import Button from "./Button";

export default function CreateAddressModal({ onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    isResidential: false,
    defaultBilling: false,
    defaultShipping: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Create New Address:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Add New Address</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
          <InputField label="Address" name="address1" value={formData.address1} onChange={handleChange} required />
          <p className="text-xs text-gray-500">Example: 1234 Main Street</p>

          <InputField name="address2" value={formData.address2} onChange={handleChange} placeholder="(optional)" />
          <p className="text-xs text-gray-500">Example: Apt. 3 or Suite #1516</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="City" name="city" value={formData.city} onChange={handleChange} required />
            <Dropdown label="State" name="state" value={formData.state} onChange={handleChange} options={["-- Select --", "CA", "NY", "TX"]} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
            <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isResidential" checked={formData.isResidential} onChange={handleChange} />
              <span>This is a Residential Address</span>
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" name="defaultBilling" checked={formData.defaultBilling} onChange={handleChange} />
              <span>Make this my default billing address</span>
            </label>

            <label className="flex items-center gap-2">
              <input type="checkbox" name="defaultShipping" checked={formData.defaultShipping} onChange={handleChange} />
              <span>Make this my default shipping address</span>
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button type="submit" className="bg-red-600 hover:bg-red-700">Save Address</Button>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
