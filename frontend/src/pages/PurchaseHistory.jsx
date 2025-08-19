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
} from "common";
import api from "api/api";
import endpoint from "api/endpoints";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector, useDispatch } from "react-redux";
import { ListOrdersHistory, ListProductHistory } from "components";

/* Subscriptions */
import ListSubscriptions from "components/product/ListSubscriptions";
import {
  selectSubscriptions,
  cancelSubscription,
  updateSubscriptionInterval,
} from "store/slices/subscriptionsSlice";

/* ===== helpers for summary card (dates) ===== */
function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}
function addMonthsSafe(date, months) {
  const d = new Date(date.getTime());
  const day = d.getDate();
  const targetMonth = d.getMonth() + months;
  const targetYear = d.getFullYear() + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  const endDay = daysInMonth(targetYear, normalizedMonth);
  const clamped = Math.min(day, endDay);
  const res = new Date(d);
  res.setFullYear(targetYear, normalizedMonth, clamped);
  return res;
}
function nextFromToday(intervalStr) {
  const n = parseInt(intervalStr || "1", 10);
  return addMonthsSafe(new Date(), Number.isFinite(n) ? n : 1);
}
function formatLocalDateToronto(date) {
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/Toronto",
  });
}

/* ===== temporary mock data for preview ===== */
const MOCK_SUBSCRIPTIONS = [
  {
    id: "mock-1",
    itemid: "3D Dental: Pre-bent Needle Tips Gray 22ga. Flow 100 pieces- #PBSL",
    displayname:
      "3D Dental: Pre-bent Needle Tips Gray 22ga. Flow 100 pieces- #PBSL",
    file_url: "", // will use your Image fallback
    interval: "2",
  },
  {
    id: "mock-2",
    itemid: "3D-Dental: 200 Absorbent Paper Points - PPB45-80",
    displayname: "3D-Dental: 200 Absorbent Paper Points - PPB45-80",
    file_url: "",
    interval: "3",
  },
];

export default function PurchaseHistory() {
  const { getAccessTokenSilently } = useAuth0();
  const userInfo = useSelector((state) => state.user.info);

  const dispatch = useDispatch();
  const subscriptions = useSelector(selectSubscriptions);

  // local mock state (used only when there are no real subscriptions)
  const [mockSubs, setMockSubs] = useState(MOCK_SUBSCRIPTIONS);

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
    ...Array.from(
      new Set(orders.map((order) => order.status || "Pending Fulfillment"))
    ).map((status) => ({ value: status, label: status })),
  ];

  // fetch orders
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

  // filter orders
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

  /* ===== subscription handlers (supports mock mode) ===== */
  const usingMock = !subscriptions || subscriptions.length === 0;
  const subsForDisplay = usingMock ? mockSubs : subscriptions;

  const handleCancelSub = (s) => {
    if (usingMock) {
      setMockSubs((prev) => prev.filter((x) => x.id !== s.id));
    } else {
      dispatch(cancelSubscription({ id: s.id }));
    }
  };

  const handleChangeInterval = (s, interval) => {
    if (usingMock) {
      setMockSubs((prev) =>
        prev.map((x) => (x.id === s.id ? { ...x, interval } : x))
      );
    } else {
      dispatch(updateSubscriptionInterval({ id: s.id, interval }));
    }
  };

  /* ===== summary card data (mirrors your Order Summary style) ===== */
  const totalActive = subsForDisplay.length;
  const nextDates = subsForDisplay.map((s) => nextFromToday(s.interval));
  const earliestNextDate =
    nextDates.length > 0
      ? nextDates.reduce((min, d) => (d < min ? d : min), nextDates[0])
      : null;

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

      {/* Content */}
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
              options={sortOptions}
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
        /* ===== Subscriptions tab (with mock preview + summary card) ===== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: list */}
          <div className="lg:col-span-2">
            <ListSubscriptions
              items={subsForDisplay}
              onCancel={handleCancelSub}
              onChangeInterval={handleChangeInterval}
            />
          </div>

          {/* Right: summary card (styled like CartOrderSummary) */}
          <div className="border p-6 rounded shadow-md h-fit">
            <h3 className="text-xl font-semibold mb-4">Subscription Summary</h3>

            <div className="flex justify-between items-center py-2 border-t border-gray-200 text-base font-semibold">
              <span className="text-gray-700">Active subscriptions</span>
              <span className="text-gray-900">{totalActive}</span>
            </div>

            <Paragraph className="text-xs text-gray-500 mb-4 mt-2">
              Preview only. These are placeholder items to visualize your
              subscription list.
            </Paragraph>

            <div className="py-2 border-t border-gray-200 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Earliest next delivery</span>
                <span className="text-gray-900">
                  {earliestNextDate
                    ? formatLocalDateToronto(earliestNextDate)
                    : "—"}
                </span>
              </div>
            </div>

            <button
              className="w-full mt-4 bg-gray-700 text-white py-3 rounded hover:bg-gray-800"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Manage Subscriptions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
