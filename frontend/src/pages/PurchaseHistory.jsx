// src/pages/PurchaseHistory.jsx
import React, { useState } from "react";
import InputField from "../common/InputField";
import Dropdown from "../common/Dropdown";
import Breadcrumb from "../common/Breadcrumb";
import api from "../api/api";
import endpoint from "../api/endpoints";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "../common/Loading";
import { ErrorMessage } from "../common";

export default function PurchaseHistory() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("recent");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    async function fetchOrders() {
      if (!user?.sub) return;
      setLoading(true);
      setError(null);
      try {
        const token = await getAccessTokenSilently();
        const url = endpoint.GET_TRANSACTION_BY_EMAIL("liamtran@gmail.com");
        const res = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.items || res.data || []);
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user?.sub, getAccessTokenSilently]);

  const sortOptions = ["Most Recent", "Oldest First"];
  const sortValues = ["recent", "oldest"];
  const statusOptions = ["All", "Open", "Delivered"];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Breadcrumb path={["Home", "Profile", "Purchase History"]} />

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Purchase History</h2>

      {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 items-end">
          <InputField
            type="date"
            label="From"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="min-w-[150px]"
          />
          <InputField
            type="date"
            label="To"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="min-w-[150px]"
          />
          <Dropdown
            label="Sort By"
            options={sortOptions}
            value={sortOptions[sortValues.indexOf(sort)]}
            onChange={(e) => setSort(sortValues[sortOptions.indexOf(e.target.value)])}
            className="min-w-[150px]"
          />
          <Dropdown
            label="Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="min-w-[150px]"
          />
        </div>


      {/* Order List */}
      <div className="bg-white border rounded shadow-sm">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 border-b last:border-b-0 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-gray-700">Order #{order.id}</p>
              <p className="text-sm text-gray-500 mb-1">
                Placed on {order.date || "Unknown"}
              </p>
              {order.shipcarrier && (
                <p className="text-sm text-gray-600">
                  Carrier: <span className="font-medium">{order.shipcarrier}</span>
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{order.status || "Pending Fulfillment"}</p>
              {order.foreigntotal && (
                <p className="text-base font-semibold text-gray-800">
                  ${order.foreigntotal}
                </p>
              )}
            </div>
          </div>
        ))}

        {!loading && orders.length === 0 && (
          <p className="text-center text-gray-500 py-6">
            No orders match your filters.
          </p>
        )}
        {loading && <Loading className="text-center py-6" />}
        {error && <ErrorMessage message={error} className="text-center py-6" />}
      </div>
    </div>
  );
}
