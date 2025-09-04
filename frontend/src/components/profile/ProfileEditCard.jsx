// src/components/ProfileEditCard.jsx
import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "store/slices/userSlice";

import api from "api/api";
import endpoint from "api/endpoints";
import {
  InputField,
  Button,
  AddressModal,
  FormSubmit,
  ErrorMessage,
  Loading,
  Toast,
} from "common";

import { validatePhone, generateRandomPassword } from "../../config/config";

export default function ProfileEditCard({ onClose, error }) {
  const { user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.user.info);

  const [formData, setFormData] = useState({
    firstName: customer?.firstname || "",
    lastName: customer?.lastname || "",
    homePhone: customer?.homePhone || "",
    mobilePhone: customer?.mobilePhone || "",
  });

  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!validatePhone(formData.homePhone)) {
      newErrors.homePhone = "Home phone must be exactly 10 digits if provided.";
    }
    if (!validatePhone(formData.mobilePhone)) {
      newErrors.mobilePhone =
        "Mobile phone must be exactly 10 digits if provided.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Generate a random secure password since Auth0 handles authentication
    const randomPassword = generateRandomPassword();

    try {
      setSubmitting(true);
      const token = await getAccessTokenSilently();
      await api.post(
        endpoint.POST_CREATE_CUSTOMER(),
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          homePhone: formData.homePhone,
          mobilePhone: formData.mobilePhone,
          email: user.email,
          entityStatus: { id: 6 },
          subsidiary: { id: 2 },
          category: { id: 15 },
          isPerson: true,
          giveAccess: true,
          password: randomPassword,
          password2: randomPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(fetchUserInfo({ user, getAccessTokenSilently }));
      Toast.success("Profile created successfully!");
      if (onClose) onClose();
    } catch (err) {
      setErrors({ form: "Failed to create profile." });
      Toast.error("Failed to create profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
      {submitting && <Loading />}
      <FormSubmit onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} />}
        {errors.form && <ErrorMessage message={errors.form} />}
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
          placeholder="123-456-7890"
          error={errors?.homePhone}
        />
        <InputField
          label="Mobile Phone"
          name="mobilePhone"
          value={formData.mobilePhone}
          onChange={handleChange}
          maxLength={14}
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
