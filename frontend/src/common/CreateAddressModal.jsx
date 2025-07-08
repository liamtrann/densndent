// src/common/CreateAddressModal.jsx
import React, { useState, useEffect } from "react";
import InputField from "./InputField";
import Dropdown from "./Dropdown";
import Button from "./Button";
import api from "../api/api";
import endpoint from "../api/endpoints";
import { useAuth0 } from "@auth0/auth0-react";

export default function CreateAddressModal({
  onClose,
  onAddressCreated,
  isEditing = false,
  existingAddress = null,
}) {
  const { user, getAccessTokenSilently } = useAuth0();

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

  useEffect(() => {
    if (existingAddress) {
      setFormData({ ...existingAddress });
    }
  }, [existingAddress]);

  const stateOptions = [
    { label: "-- Select --", value: "" },
    { label: "California", value: "CA" },
    { label: "New York", value: "NY" },
    { label: "Texas", value: "TX" },
    { label: "Ontario", value: "ON" },
    { label: "Quebec", value: "QC" },
    { label: "British Columbia", value: "BC" },
    { label: "Alberta", value: "AB" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getAccessTokenSilently();
      const payload = {
        email: user?.email,
        address: formData,
      };

      const method = isEditing ? api.put : api.post;
      const endpointFn = isEditing ? endpoint.UPDATE_ADDRESS() : endpoint.CREATE_NEW_ADDRESS();

      const res = await method(endpointFn, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Address saved:", res.data);
      alert("Address saved successfully!");

      if (onAddressCreated) onAddressCreated();
      onClose();
    } catch (err) {
      console.error("❌ Error saving address:", err.response?.data || err.message || err);
      alert("Failed to save address. Please try again.");
    }
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

        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Update Address" : "Add New Address"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
          <InputField label="Address" name="address1" value={formData.address1} onChange={handleChange} required />
          <InputField name="address2" value={formData.address2} onChange={handleChange} placeholder="(optional)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="City" name="city" value={formData.city} onChange={handleChange} required />
            <Dropdown label="State" name="state" value={formData.state} onChange={handleChange} options={stateOptions} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
            <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <InputField type="checkbox" name="isResidential" checked={formData.isResidential} onChange={handleChange} label="This is a Residential Address" />
            <InputField type="checkbox" name="defaultBilling" checked={formData.defaultBilling} onChange={handleChange} label="Make this my default billing address" />
            <InputField type="checkbox" name="defaultShipping" checked={formData.defaultShipping} onChange={handleChange} label="Make this my default shipping address" />
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
