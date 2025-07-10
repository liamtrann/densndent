// /common/AddAddressModal.jsx
import React, { useState } from "react";
import Modal from "react-modal";
import InputField from "./InputField";
import Dropdown from "./Dropdown";
import Button from "./Button";

Modal.setAppElement("#root");

const stateOptions = [
  { key: "ny", value: "NY", label: "New York" },
  { key: "ca", value: "CA", label: "California" },
  { key: "tx", value: "TX", label: "Texas" },
];

export default function AddAddressModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    isResidential: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.zip) newErrors.zip = "Zip Code is required";
    if (!formData.phone) newErrors.phone = "Phone Number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Address"
      className="bg-white rounded-md p-6 w-full max-w-xl mx-auto mt-20 outline-none relative shadow-xl"
      overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start z-50"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Add New Address</h2>
        <button onClick={onClose} className="text-gray-500 text-xl hover:text-black">×</button>
      </div>

      <p className="text-sm text-red-600 mb-4">Required <span className="text-red-700">*</span></p>

      <div className="space-y-4">
        <InputField
          label="Full Name *"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          placeholder="Huzaifa Khan"
        />
        <InputField
          label="Address *"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          placeholder="1234 Main Street"
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
          label="State *"
          name="state"
          value={formData.state}
          onChange={handleChange}
          options={stateOptions}
          error={errors.state}
        />
        <InputField
          label="Zip Code *"
          name="zip"
          value={formData.zip}
          onChange={handleChange}
          error={errors.zip}
          placeholder="94117"
        />
        <InputField
          label="Phone Number *"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="555-123-1234"
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
        <Button variant="link" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Address</Button>
      </div>
    </Modal>
  );
}
