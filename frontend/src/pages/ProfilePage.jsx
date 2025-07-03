import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../api/api";
import endpoint from "../api/endpoints";
import Loading from "../common/Loading";
import ErrorMessage from "../common/ErrorMessage";

export default function ProfilePage() {
    const { isAuthenticated, isLoading, loginWithRedirect, user, getAccessTokenSilently } = useAuth0();
    const [customerLoading, setCustomerLoading] = useState(false);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     if (!isLoading && !isAuthenticated) {
    //         loginWithRedirect();
    //         return;
    //     }
    //     // Fetch customer data by email when authenticated
    //     if (!isLoading && isAuthenticated && user?.email) {
    //         setCustomerLoading(true);
    //         setError(null);
    //         (async () => {
    //             try {
    //                 const token = await getAccessTokenSilently();
    //                 const res = await api.get(
    //                     endpoint.GET_CUSTOMER_BY_EMAIL(user.email),
    //                     { headers: { Authorization: `Bearer ${token}` } }
    //                 );
    //                 console.log("Customer data:", res.data);
    //             } catch (err) {
    //                 setError(err?.message || "Failed to fetch customer data.");
    //                 console.error("Failed to fetch customer data:", err);
    //             } finally {
    //                 setCustomerLoading(false);
    //             }
    //         })();
    //     }
    // }, [isAuthenticated, isLoading, loginWithRedirect, user, getAccessTokenSilently]);

    // if (isLoading || !isAuthenticated || customerLoading) {
    //     return <Loading />;
    // }

    // if (error) {
    //     return <ErrorMessage message={error} />;
    // }

    return (
  <div className="max-w-6xl mx-auto px-6 py-10">
    {/* Recent Purchases */}
    <div className="mb-10">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Recent Purchases</h2>
        <a href="/orders" className="text-blue-600 text-sm hover:underline">View Purchase History</a>
      </div>
      <div className="bg-gray-100 p-4 rounded text-center text-sm text-gray-600">
        You don't have any purchases in your account right now
      </div>
    </div>

    {/* My Settings */}
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">My Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white border p-4 rounded shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Profile</h3>
          <p className="text-sm text-gray-900 font-medium">{user.name}</p>
          <p className="text-sm text-gray-600 mb-4">{user.email}</p>
          <a href="#" className="text-sm text-blue-600 hover:underline">Edit</a>
        </div>

        {/* Shipping Card */}
        <div className="bg-white border p-4 rounded shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Shipping</h3>
          <p className="text-sm text-gray-600 mb-4">
            We have no default address on file for this account.
          </p>
          <a href="#" className="text-sm text-blue-600 hover:underline">Create New Address</a>
        </div>

        {/* Payment Card */}
        <div className="bg-white border p-4 rounded shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Payment</h3>
          <p className="text-sm text-gray-600 mb-4">
            We have no default credit card on file for this account.
          </p>
          <a href="#" className="text-sm text-blue-600 hover:underline">Add a Credit Card</a>
        </div>

      </div>
    </div>
  </div>
);

}
