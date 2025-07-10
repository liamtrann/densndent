// src/common/CreateAddressModal.jsx
import React, { useState, useEffect } from "react";
import InputField from "./InputField";
import Dropdown from "./Dropdown";
import Button from "./Button";
import api from "../api/api";
import endpoint from "../api/endpoints";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from 'react-redux';
import { fetchUserInfo } from '../redux/slices/userSlice';
import FormSubmit from "./FormSubmit";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

export default function CreateAddressModal({ onClose, onAddressCreated, address = null, customerId, error }) {
  const { user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  // Always call hooks first
  const [formData, setFormData] = useState({
    fullName: "",
    address1: "",
    city: "",
    state: "",
    zip: "",
    defaultBilling: false,
    defaultShipping: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill form if updating
  useEffect(() => {
    if (address) {
      setFormData({
        fullName: address.fullName || "",
        address1: address.address1 || "",
        city: address.city || "",
        state: address.state || "",
        zip: address.zip || "",
        defaultBilling: !!address.defaultBilling,
        defaultShipping: !!address.defaultShipping,
      });
    }
  }, [address]);

  // If no customerId, show message and block form
  if (!customerId) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        {error && <ErrorMessage message={error} />}
        <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
          <button
            className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-xl font-semibold mb-4">Update Address</h2>
          <div className="text-red-600 mb-4">You need to create your profile before you can update your address.</div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    );
  }

  // Replace stateOptions with Canadian provinces/territories from provided data
  const stateOptions = [
    { label: '-- Select --', value: '' },
    { label: 'Alberta (AB)', value: 'AB' },
    { label: 'British Columbia (BC)', value: 'BC' },
    { label: 'Manitoba (MB)', value: 'MB' },
    { label: 'New Brunswick (NB)', value: 'NB' },
    { label: 'Newfoundland and Labrador (NL)', value: 'NL' },
    { label: 'Nova Scotia (NS)', value: 'NS' },
    { label: 'Northwest Territories (NT)', value: 'NT' },
    { label: 'Nunavut (NU)', value: 'NU' },
    { label: 'Ontario (ON)', value: 'ON' },
    { label: 'Prince Edward Island (PE)', value: 'PE' },
    { label: 'Quebec (QC)', value: 'QC' },
    { label: 'Saskatchewan (SK)', value: 'SK' },
    { label: 'Yukon (YT)', value: 'YT' },
    { label: 'China', value: 'CN' },
    { label: 'Hong Kong', value: 'HK' },
    { label: 'India', value: 'IN' },
  ];

  const validateZip = (zip) => /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/.test(zip);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!validateZip(formData.zip)) {
      newErrors.zip = "Zip code must be 6 characters, alternating letter and number (e.g., A1B2C3).";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      const token = await getAccessTokenSilently();
      await api.patch(
        endpoint.PATCH_UPDATE_CUSTOMER(customerId),
        {
          addressBook: {
            items: [
              {
                addressBookAddress: {
                  addr1: formData.address1,
                  city: formData.city,
                  state: formData.state,
                  zip: formData.zip,
                  country: { id: "CA" },
                },
                defaultBilling: !!formData.defaultBilling,
                defaultShipping: !!formData.defaultShipping,
              },
            ],
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(fetchUserInfo({ user, getAccessTokenSilently })); // Refresh Redux user info
      if (onAddressCreated) onAddressCreated();
      setTimeout(() => {
        onClose();
      }, 0);
    } catch (err) {
      console.error("❌ Error saving address:", err?.response?.data || err?.message || err);
      alert("Failed to save address. Please try again.");
    } finally {
      setSubmitting(false);
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

        <h2 className="text-xl font-semibold mb-4">Update Address</h2>

        {submitting && <Loading />}
        <FormSubmit onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Address"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            required
          />
          <p className="text-xs text-gray-500">Example: 1234 Main Street</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <Dropdown
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              options={stateOptions}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Zip Code"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              required
              maxLength={6}
              pattern="[A-Za-z][0-9][A-Za-z][0-9][A-Za-z][0-9]"
              placeholder="A1B2C3"
              error={errors.zip}
            />
          </div>

          <div className="flex items-center mb-4">
            <InputField
              type="checkbox"
              label="Set as default billing address"
              name="defaultBilling"
              checked={formData.defaultBilling}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center mb-4">
            <InputField
              type="checkbox"
              label="Set as default shipping address"
              name="defaultShipping"
              checked={formData.defaultShipping}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Save Address
            </Button>
          </div>
        </FormSubmit>
      </div>
    </div>
  );
}
