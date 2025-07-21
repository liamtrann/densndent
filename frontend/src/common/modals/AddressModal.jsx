import React, { useState } from "react";
import Modal from "react-modal";
import InputField from "../ui/InputField";
import Dropdown from "../ui/Dropdown";
import Button from "../ui/Button";
import stateMappings from "../../config/states";
import {
  validatePhone,
  validatePostalCode,
} from "../../config/config"; // Assumes these are exported

Modal.setAppElement("#root");

export default function AddressModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    isResidential: false,
    country: "us",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State/Province is required";

    // Validate zip/postal code
    const zipError = validatePostalCode(formData.zip, formData.country);
    if (zipError) newErrors.zip = zipError;

    // Validate phone
    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(formData);
  };

  const states = stateMappings[formData.country?.toLowerCase?.()] || {};
  const stateOptions = Object.entries(states).map(([label, value]) => ({
    label:
      label
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    value,
  }));

  const countryOptions = [
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Address"
      className="bg-white rounded-md p-6 w-full max-w-xl mx-auto mt-20 outline-none relative shadow-xl overflow-y-auto max-h-[90vh]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Add New Address</h2>
        <button
          onClick={onClose}
          className="text-gray-500 text-xl hover:text-black"
        >
          ×
        </button>
      </div>

      <p className="text-sm text-red-600 mb-4">
        Required <span className="text-red-700">*</span>
      </p>

      <div className="space-y-4">
        <InputField
          label="Full Name *"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />
        <InputField
          label="Address *"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
        />
        <InputField
          name="address2"
          value={formData.address2}
          onChange={handleChange}
          placeholder="Apt. 3 or Suite #1516"
        />
        <InputField
          label="City *"
          name="city"
          value={formData.city}
          onChange={handleChange}
          error={errors.city}
        />
        <Dropdown
          label="Country *"
          name="country"
          value={formData.country}
          onChange={handleChange}
          options={countryOptions}
        />
        <Dropdown
          label="State/Province *"
          name="state"
          value={formData.state}
          onChange={handleChange}
          options={stateOptions}
          error={errors.state}
        />
        <InputField
          label="Postal/Zip Code *"
          name="zip"
          value={formData.zip}
          onChange={handleChange}
          error={errors.zip}
        />
        <InputField
          label="Phone Number *"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isResidential"
            checked={formData.isResidential}
            onChange={handleChange}
          />
          This is a Residential Address
        </label>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button variant="link" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Address</Button>
      </div>
    </Modal>
  );
}
