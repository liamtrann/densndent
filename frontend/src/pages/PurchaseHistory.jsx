// src/pages/PurchaseHistory.jsx
import { useAuth0 } from "@auth0/auth0-react";
import ListSubscriptions from "components/product/ListSubscriptions";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSubscriptions,
  fetchSubscriptionsForCustomer,
} from "store/slices/subscriptionsSlice";

import api from "api/api";
import endpoint from "api/endpoints";
import {
  InputField,
  Dropdown,
  Breadcrumb,
  Loading,
  ErrorMessage,
  Paragraph,
  TextButton,
  PreferDeliveryDaySelector,
} from "common";
import { ListOrdersHistory } from "components";
import { createStatusOptions } from "constants/constant";

import { ListProductNoFilter } from "@/components/product";

/* small date helpers for summary */
function daysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}
function addMonthsSafe(d0, n) {
  const d = new Date(d0.getTime());
  const day = d.getDate();
  const tm = d.getMonth() + n;
  const ty = d.getFullYear() + Math.floor(tm / 12);
  const nm = ((tm % 12) + 12) % 12;
  const end = daysInMonth(ty, nm);
  const clamped = Math.min(day, end);
  const res = new Date(d);
  res.setFullYear(ty, nm, clamped);
  return res;
}
function nextFromToday(s) {
  const n = parseInt(s || "1", 10);
  return addMonthsSafe(new Date(), Number.isFinite(n) ? n : 1);
}
function formatLocalDateToronto(d) {
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/Toronto",
  });
}

export default function PurchaseHistory() {
  const { getAccessTokenSilently } = useAuth0();
  const userInfo = useSelector((state) => state.user.info);
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

  const statusOptions = createStatusOptions(orders);

  // orders
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
      const d = new Date(order.trandate);
      if (isNaN(d)) return false;
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });

    if (status !== "All" && status !== "") {
      filtered = filtered.filter(
        (o) => (o.status || "Pending Fulfillment") === status
      );
    }

    filtered.sort((a, b) =>
      sort === "recent"
        ? new Date(b.trandate) - new Date(a.trandate)
        : new Date(a.trandate) - new Date(b.trandate)
    );

    setFilteredOrders(filtered);
  }, [fromDate, toDate, status, sort, orders]);

  // fetch subscriptions when entering the tab
  useEffect(() => {
    if (activeTab === "subscriptions" && userInfo?.id) {
      dispatch(
        fetchSubscriptionsForCustomer({
          customerId: userInfo.id,
          getAccessTokenSilently,
        })
      );
    }
  }, [activeTab, userInfo?.id, getAccessTokenSilently, dispatch]);

  // summary
  const nextDates = subscriptions.map((s) => nextFromToday(s.interval));
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

      {activeTab === "orders" ? (
        <>
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
            <ListProductNoFilter searchIds={userInfo.id} by="orderHistory" />
          ) : (
            <div className="text-center py-12">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ListSubscriptions />
          </div>

          <div className="space-y-4">
            <div className="py-2 border-t border-gray-200 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Earliest next order</span>
                <span className="text-gray-900">
                  {earliestNextDate
                    ? formatLocalDateToronto(earliestNextDate)
                    : "—"}
                </span>
              </div>
            </div>

            <PreferDeliveryDaySelector className="py-2 border-t border-gray-200" />
          </div>
        </div>
      )}
    </div>
  );
}
