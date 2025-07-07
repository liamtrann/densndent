// src/pages/PurchaseHistory.jsx
import React, { useState, useEffect } from "react";
import InputField from "../common/InputField";
import Dropdown from "../common/Dropdown";
import Breadcrumb from "../common/Breadcrumb";
import api from "../api/api";
import endpoint from "../api/endpoints";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "../common/Loading";
import { ErrorMessage } from "../common";
import Paragraph from "../common/Paragraph";

export default function PurchaseHistory() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("recent");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sortOptions = ["Most Recent", "Oldest First"];
  const sortValues = ["recent", "oldest"];
  const statusOptions = ["All", "Open", "Delivered"];

  useEffect(() => {
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

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Breadcrumb path={["Home", "Profile", "Purchase History"]} />

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Purchase History</h2>

      {/* Filters */}
      <div className="flex flex-wrap md:flex-nowrap gap-4 mb-6">
        <div className="flex-1">
          <InputField
            type="date"
            label="From"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <InputField
            type="date"
            label="To"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Dropdown
            label="Sort By"
            options={sortOptions}
            value={sortOptions[sortValues.indexOf(sort)]}
            onChange={(e) =>
              setSort(sortValues[sortOptions.indexOf(e.target.value)])
            }
          />
        </div>
        <div className="flex-1">
          <Dropdown
            label="Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
      </div>

      {/* Order List */}
      <div className="bg-white border rounded shadow-sm">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 border-b last:border-b-0 flex justify-between items-center"
          >
            <div>
              <Paragraph className="font-medium">Order #{order.id}</Paragraph>
              <Paragraph className="text-sm text-gray-500 mb-1">
                Placed on {order.date || "Unknown"}
              </Paragraph>
              {order.shipcarrier && (
                <Paragraph className="text-sm text-gray-600">
                  Carrier:{" "}
                  <span className="font-medium">{order.shipcarrier}</span>
                </Paragraph>
              )}
            </div>
            <div className="text-right">
              <Paragraph className="text-sm text-gray-600">
                {order.status || "Pending Fulfillment"}
              </Paragraph>
              {order.foreigntotal && (
                <Paragraph className="text-base font-semibold text-gray-800">
                  ${order.foreigntotal}
                </Paragraph>
              )}
            </div>
          </div>
        ))}

        {!loading && orders.length === 0 && (
          <Paragraph className="text-center text-gray-500 py-6">
            No orders match your filters.
          </Paragraph>
        )}
        {loading && <Loading className="text-center py-6" />}
        {error && (
          <ErrorMessage message={error} className="text-center py-6" />
        )}
      </div>
    </div>
  );
}
