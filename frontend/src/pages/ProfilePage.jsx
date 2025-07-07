// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../api/api";
import endpoint from "../api/endpoints";
import { RecentPurchases, SettingsCard, ProfileEditCard } from "../components";
import { CreateAddressModal, ErrorMessage } from "../common";

export default function ProfilePage() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCustomer() {
      if (user?.email) {
        try {
          const token = await getAccessTokenSilently();
          const res = await api.get(
            endpoint.GET_CUSTOMER_BY_EMAIL(user.email),
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setCustomer(res.data);
          setError(null);
        } catch (err) {
          setCustomer(null);
          setError(err.response?.data?.error || "An error occurred");
        }
      }
    }
    fetchCustomer();
  }, [user?.email, getAccessTokenSilently]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {error && <ErrorMessage message={error} />}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Recent Purchases</h2>
        <a
          href="/profile/history"
          className="text-sm text-blue-600 hover:underline"
        >
          View Purchase History →
        </a>
      </div>

      <RecentPurchases />

      <h2 className="text-lg font-semibold text-gray-800 mt-10 mb-4">My Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SettingsCard
          title="Profile"
          description={
            <>
              <p>{user?.name}</p>
              <p>{user?.email}</p>
              {customer?.entityid && <p>Customer #: {customer.entityid}</p>}
            </>
          }
          actionLabel="Edit"
          onAction={(e) => {
            e.preventDefault();
            setShowEditModal(true);
          }}
        />

        <SettingsCard
          title="Shipping"
          description="We have no default address on file for this account."
          actionLabel="Create New Address"
          onAction={(e) => {
            e.preventDefault();
            setShowAddressModal(true);
          }}
        />

        <SettingsCard
          title="Payment"
          description="We have no default credit card on file for this account."
          actionLabel="Add a Credit Card"
        />
      </div>

      {showAddressModal && (
        <CreateAddressModal onClose={() => setShowAddressModal(false)} />
      )}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-xl relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <ProfileEditCard onClose={() => setShowEditModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
