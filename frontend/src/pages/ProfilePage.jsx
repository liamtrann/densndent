import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../api/api";
import endpoint from "../api/endpoints";
import { RecentPurchases, SettingsCard } from "../components";
import { ErrorMessage, CreateAddressModal } from "../common";
import { Link, useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  console.log(customer)

  const updateAddress = (newAddress) => {

    console.log(newAddress)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {error && <ErrorMessage message={error} />}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Recent Purchases</h2>
        <Link
          to="/profile/history"
          className="text-sm text-blue-600 hover:underline"
        >
          View Purchase History →
        </Link>
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
          onAction={() => navigate("/profile/edit")}
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
    </div>
  );
}
