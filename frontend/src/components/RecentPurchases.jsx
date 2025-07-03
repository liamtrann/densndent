// src/components/profile/RecentPurchases.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function RecentPurchases() {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Recent Purchases</h2>
        <Link to="/orders" className="text-blue-600 text-sm hover:underline">
          View Purchase History
        </Link>
      </div>
      <div className="bg-gray-100 p-4 rounded text-center text-sm text-gray-600">
        You don't have any purchases in your account right now
      </div>
    </div>
  );
}
