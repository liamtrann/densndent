// src/components/ProfileEditCard.jsx
import React, { useState, useEffect } from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";
import AddressModal from "../common/AddressModal";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../api/api";
import endpoint from "../api/endpoints";
import FormSubmit from "../common/FormSubmit";

export default function ProfileEditCard({ onClose, onCreate }) {
  const { user, getAccessTokenSilently } = useAuth0();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    homePhone: "",
    mobilePhone: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchCustomer() {
      if (user?.email) {
        try {
          const token = await getAccessTokenSilently();
          const res = await api.get(
            endpoint.GET_CUSTOMER_BY_EMAIL(user.email),
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const data = res.data;
          setFormData({
            firstName: data.firstname || "",
            lastName: data.lastname || "",
            homePhone: data.homePhone || "",
            mobilePhone: data.mobilePhone || "",
          });
        } catch (err) {
          console.error("Failed to fetch customer info:", err);
        }
      }
    }
    fetchCustomer();
  }, [user?.email, getAccessTokenSilently]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field as user types
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validatePhone = (phone) => !phone || /^\d{10}$/.test(phone.replace(/\D/g, ""));

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!validatePhone(formData.homePhone)) {
      newErrors.homePhone = "Home phone must be exactly 10 digits if provided.";
    }
    if (!validatePhone(formData.mobilePhone)) {
      newErrors.mobilePhone = "Mobile phone must be exactly 10 digits if provided.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    if (onCreate) onCreate(formData); // Call parent create
  };

  console.log(errors)

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
      <FormSubmit onSubmit={handleSubmit}>
        <InputField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <InputField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <InputField
          label="Home Phone"
          name="homePhone"
          value={formData.homePhone}
          onChange={handleChange}
          maxLength={14}
          pattern="[0-9\-\s\(\)]{10,14}"
          placeholder="123-456-7890"
          error={errors?.homePhone}
        />
        <InputField
          label="Mobile Phone"
          name="mobilePhone"
          value={formData.mobilePhone}
          onChange={handleChange}
          maxLength={14}
          pattern="[0-9\-\s\(\)]{10,14}"
          placeholder="123-456-7890"
          error={errors?.mobilePhone}
        />

        <div className="mt-2 text-sm">
          <span>Email</span>
          <br />
          <span className="text-gray-700">{user?.email}</span>
        </div>

        <div className="mt-4 flex gap-4">
          <Button type="submit">Create</Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </FormSubmit>

      {showModal && <AddressModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
