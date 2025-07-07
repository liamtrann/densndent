// src/common/AddressModal.jsx
import React, { useState } from "react";
import InputField from "./InputField";
import Button from "./Button";

export default function AddressModal({ onClose }) {
  const [formData, setFormData] = useState({
    newEmail: "",
    confirmEmail: "",
    password: "",
  });
  const states = [
    { value: "California", label: "California" },
    { value: "New York", label: "New York" },
    { value: "Texas", label: "Texas" }
  ];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Email Update:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
        <button
          className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Change Email</h2>

        <form onSubmit={handleSubmit}>
          <InputField label="New Email" name="newEmail" type="email" value={formData.newEmail} onChange={handleChange} required />
          <InputField label="Confirm New Email" name="confirmEmail" type="email" value={formData.confirmEmail} onChange={handleChange} required />
          <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />

          <p className="text-sm text-gray-600 mt-2">
            You will still be able to login with your current email address and password until your new email address is verified.
          </p>

          <div className="mt-4">
            <Button type="submit" className="bg-red-600 hover:bg-red-700">Send Verification Email</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
