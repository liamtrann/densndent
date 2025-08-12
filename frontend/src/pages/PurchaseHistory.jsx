// src/pages/PurchaseHistory.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  InputField,
  Dropdown,
  Breadcrumb,
  Loading,
  ErrorMessage,
  Paragraph,
  TextButton,
} from "common";
import api from "api/api";
import endpoint from "api/endpoints";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector, useDispatch } from "react-redux";
import { ListOrdersHistory, ListProductHistory } from "components";

/* ✅ NEW: subscriptions */
import ListSubscriptions from "components/product/ListSubscriptions";
import {
  selectSubscriptions,
  cancelSubscription,
  updateSubscriptionInterval,
} from "store/slices/subscriptionsSlice";

export default function PurchaseHistory() {
  const { getAccessTokenSilently } = useAuth0();
  const userInfo = useSelector((state) => state.user.info);

  /* ✅ NEW: subscriptions state */
  const dispatch = useDispatch();
  const subscriptions = useSelector(selectSubscriptions);

  const [activeTab, setActiveTab] = useState("orders");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("recent");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "oldest", label: "Oldest First" },
  ];

  const statusOptions = [
    { value: "All", label: "All" },
    ...Array.from(new Set(orders.map((order) => order.status || "Pending Fulfillment"))).map(
      (status) => ({ value: status, label: status })
    ),
  ];

  useEffect(() => {
    async function fetchOrders() {
      if (!userInfo?.id) return;
      setLoading(true);
      setError(null);
      try {
        const token = await getAccessTokenSilently();
        const url = endpoint.GET_TRANSACTION_BY_ID({ userId: userInfo.id });
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

  useEffect(() => {
    if (!orders.length) {
      setFilteredOrders([]);
      return;
    }
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    let filtered = orders.filter((order) => {
      const orderDate = new Date(order.trandate);
      if (isNaN(orderDate)) return false;
      if (from && orderDate < from) return false;
      if (to && orderDate > to) return false;
      return true;
    });

    if (status !== "All" && status !== "") {
      filtered = filtered.filter(
        (o) => (o.status || "Pending Fulfillment") === status
      );
    }

    if (sort === "recent") {
      filtered.sort((a, b) => new Date(b.trandate) - new Date(a.trandate));
    } else if (sort === "oldest") {
      filtered.sort((a, b) => new Date(a.trandate) - new Date(b.trandate));
    }

    setFilteredOrders(filtered);
  }, [fromDate, toDate, status, sort, orders]);

  /* ✅ handlers for subscription list */
  const handleCancelSub = (s) => {
    dispatch(cancelSubscription({ id: s.id, flavor: s.flavor || null }));
  };
  const handleChangeInterval = (s, interval) => {
    dispatch(
      updateSubscriptionInterval({
        id: s.id,
        flavor: s.flavor || null,
        interval,
      })
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Breadcrumb path={["Home", "Profile", "Purchase History"]} />

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Purchase History
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "orders"
              ? "border-smiles-orange text-smiles-orange"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Your Orders
        </button>

        <button
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "buyAgain"
              ? "border-smiles-orange text-smiles-orange"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("buyAgain")}
        >
          Buy Again
        </button>

        {/* ✅ NEW TAB */}
        <button
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "subscriptions"
              ? "border-smiles-orange text-smiles-orange"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("subscriptions")}
        >
          Subscription List
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "orders" ? (
        <>
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
              options={[
                { value: "recent", label: "Most Recent" },
                { value: "oldest", label: "Oldest First" },
              ]}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
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

          {/* Orders List */}
          {loading ? (
            <Loading message="Loading purchase history..." className="py-6" />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <ListOrdersHistory orders={filteredOrders} />
          )}
        </>
      ) : activeTab === "buyAgain" ? (
        <div>
          {userInfo?.id ? (
            <ListProductHistory userId={userInfo.id} />
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Profile Setup Required
              </h3>
              <Paragraph className="text-gray-500 mb-4">
                Please complete your profile setup to view your purchase
                history.
              </Paragraph>
              <TextButton
                className="text-blue-600 hover:text-blue-800"
                onClick={() => (window.location.href = "/profile")}
              >
                Complete Profile Setup
              </TextButton>
            </div>
          )}
        </div>
      ) : (
        /* ✅ Subscriptions Tab */
        <ListSubscriptions
          items={subscriptions}
          onCancel={handleCancelSub}
          onChangeInterval={handleChangeInterval}
        />
      )}
    </div>
  );
}
