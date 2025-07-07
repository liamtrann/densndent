import React, { useState, useEffect } from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { AddressModal } from "../common";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../api/api";
import endpoint from "../api/endpoints";

export default function ProfileEditCard() {
  const { user, getAccessTokenSilently } = useAuth0();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: user?.email || "",
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchCustomer() {
      if (user?.email) {
        try {
          const token = await getAccessTokenSilently();
          const res = await api.get(endpoint.GET_CUSTOMER_BY_EMAIL(user.email), {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = res.data;
          setFormData({
            firstName: data.firstname || "",
            lastName: data.lastname || "",
            phone: data.phone || "",
            email: user.email || "",
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", formData);
    // You can send PUT/PATCH to update customer info here
  };

  return (
    <div className="border rounded-lg p-6 shadow-sm max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
      <form onSubmit={handleSubmit}>
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
          label="Phone Number (ex/(123) 456-7890)"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(123) 456-7890"
        />

        <div className="mt-2 text-sm">
          <span>Email</span>
          <br />
          <span className="text-gray-700">{formData.email}</span>
          <span
            onClick={() => setShowModal(true)}
            className="text-blue-600 hover:underline cursor-pointer ml-2"
          >
            | Change Address
          </span>
        </div>

        <div className="mt-4">
          <Button type="submit">Update</Button>
        </div>
      </form>

      {showModal && <AddressModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
