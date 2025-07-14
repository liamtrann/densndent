// src/pages/PurchaseHistory.jsx
import React, { useState, useEffect } from "react";
import {
  InputField,
  Dropdown,
  Breadcrumb,
  Loading,
  ErrorMessage,
  Paragraph,
  TextButton,
} from "../common";
import api from "../api/api";
import endpoint from "../api/endpoints";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import RecentPurchases from "../components/RecentPurchases";

export default function PurchaseHistory() {
  const { user, getAccessTokenSilently } = useAuth0();
  const userInfo = useSelector((state) => state.user.info);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("recent");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sortValues = ["recent", "oldest"];

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "oldest", label: "Oldest First" },
  ];

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "delivered", label: "Delivered" },
    { value: "pending", label: "Pending Fulfillment" },
    { value: "billed", label: "Billed" },
  ];

  // Fetch orders
  useEffect(() => {
    async function fetchOrders() {
      if (!userInfo?.id) return;
      setLoading(true);
      setError(null);
      try {
        const token = await getAccessTokenSilently();
        const url = endpoint.GET_TRANSACTION_BY_ID({ id: userInfo.id });
        const res = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.items || res.data || [];
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userInfo?.id, getAccessTokenSilently]);

  // Filter by date range and status
  useEffect(() => {
    if (!orders.length) return;

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    let filtered = orders.filter((order) => {
      const orderDate = new Date(order.trandate);
      if (isNaN(orderDate)) return false;

      if (from && orderDate < from) return false;
      if (to && orderDate > to) return false;

      return true;
    });

    if (status !== "All") {
      filtered = filtered.filter(
        (o) =>
          (o.status || "Pending Fulfillment").toLowerCase() ===
          status.toLowerCase()
      );
    }

    if (sort === "recent") {
      filtered.sort((a, b) => new Date(b.trandate) - new Date(a.trandate));
    } else if (sort === "oldest") {
      filtered.sort((a, b) => new Date(a.trandate) - new Date(b.trandate));
    }

    setFilteredOrders(filtered);
  }, [fromDate, toDate, status, sort, orders]);

  console.log(orders);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Breadcrumb path={["Home", "Profile", "Purchase History"]} />

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Purchase History
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6 items-end">
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
          onChange={(e) =>
            setSort(sortValues[sortOptions.indexOf(e.target.value)])
          }
          className="min-w-[150px]"
        />
        <Dropdown
          label="Status"
          options={statusOptions}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="min-w-[150px]"
        />
        <div className="flex justify-end items-end">
          <TextButton
            className="w-full"
            onClick={() => {
              setFromDate("");
              setToDate("");
              setStatus("All");
              setSort("recent");
            }}
          >
            Reset
          </TextButton>
        </div>
      </div>

      {/* Scrollable Order List */}
      <div className="bg-white border rounded shadow-sm max-h-[500px] overflow-y-auto">
        <RecentPurchases orders={filteredOrders} />
      </div>
    </div>
  );
}
