// src/pages/ProfilePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RecentPurchases } from "../components";
import { TextButton } from "../common";
import UserInfoCard from "../components/UserInfoCard";

export default function ProfilePage() {
  const navigate = useNavigate();
  // Get customer info from Redux store
  const customer = useSelector(state => state.user.info);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Recent Purchases</h2>
        <TextButton onClick={() => navigate("/profile/history")}>View Purchase History →</TextButton>
      </div>

      <RecentPurchases />

      <h2 className="text-lg font-semibold text-gray-800 mt-10 mb-4">My Settings</h2>
      <UserInfoCard customer={customer} />
    </div>
  );
}
