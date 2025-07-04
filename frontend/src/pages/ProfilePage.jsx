// src/pages/ProfilePage.jsx
import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import RecentPurchases from "../components/RecentPurchases";
import SettingsCard from "../components/SettingsCard";
import AddressModal from "../common/AddressModal";

export default function ProfilePage() {
  const { user } = useAuth0();
  const [showAddressModal, setShowAddressModal] = useState(false);

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* View Purchase History CTA */}
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
            description={[user.name, user.email]}
            actionLabel="Edit"
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
      </div>

      {showAddressModal && (
        <AddressModal onClose={() => setShowAddressModal(false)} />
      )}
    </>
  );
}
