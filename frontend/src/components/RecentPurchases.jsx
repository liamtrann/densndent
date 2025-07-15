// components/profile/RecentPurchases.jsx
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";
import api from "../api/api";
import endpoint from "../api/endpoints";
import { Loading } from "../common";
import ListOrdersHistory from "./ListOrdersHistory";

export default function RecentPurchases({
  orders: ordersProp,
  setError: parentSetError,
}) {
  const { getAccessTokenSilently } = useAuth0();
  const userInfo = useSelector((state) => state.user.info);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Use parent setError if provided, otherwise local
  const setErrorToUse = parentSetError || setError;

  useEffect(() => {
    if (ordersProp) {
      setOrders(ordersProp);
      setLoading(false);
      return;
    }
    async function fetchRecentOrders() {
      if (!userInfo?.id) return;
      setLoading(true);
      setErrorToUse(null);
      try {
        const token = await getAccessTokenSilently();
        const url = endpoint.GET_TRANSACTION_BY_ID({
          userId: userInfo.id,
          limit: 4,
        });
        const res = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.items || res.data || [];
        setOrders(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (err) {
        setErrorToUse(
          err?.response?.data?.error || "Failed to fetch recent orders"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchRecentOrders();
  }, [userInfo?.id, getAccessTokenSilently, setErrorToUse, ordersProp]);

  if (loading) {
    return (
      <div className="mb-10">
        <Loading message="Loading recent purchases..." className="py-6" />
      </div>
    );
  }

  return (
    <div className="mb-10">
      <ListOrdersHistory orders={orders} />
    </div>
  );
}
