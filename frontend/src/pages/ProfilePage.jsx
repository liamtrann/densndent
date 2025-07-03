// pages/ProfilePage.jsx
import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
// import api and endpoints when wiring up backend
import RecentPurchases from "../components/RecentPurchases";
import SettingsCard from "../components/SettingsCard";

export default function ProfilePage() {
  const { user } = useAuth0();
  const [showAddressModal, setShowAddressModal] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <RecentPurchases />

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">My Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile */}
          <SettingsCard title="Profile">
            <p className="text-sm text-gray-900 font-medium">{user.name}</p>
            <p className="text-sm text-gray-600 mb-4">{user.email}</p>
            <a href="#" className="text-sm text-blue-600 hover:underline">Edit</a>
          </SettingsCard>

          {/* Shipping */}
          <SettingsCard title="Shipping">
            <p className="text-sm text-gray-600 mb-4">
              We have no default address on file for this account.
            </p>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowAddressModal(true);
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Create New Address
            </a>
          </SettingsCard>

          {/* Payment */}
          <SettingsCard title="Payment">
            <p className="text-sm text-gray-600 mb-4">
              We have no default credit card on file for this account.
            </p>
            <a href="#" className="text-sm text-blue-600 hover:underline">Add a Credit Card</a>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}
