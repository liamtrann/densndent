// components/profile/RecentPurchases.jsx
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from 'react-redux';
import api from "../api/api";
import endpoint from "../api/endpoints";
import Paragraph from "../common/Paragraph";

export default function RecentPurchases({ setLoading, setError: parentSetError }) {
  const { getAccessTokenSilently } = useAuth0();
  const userInfo = useSelector(state => state.user.info);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  // Use parent setError if provided, otherwise local
  const setErrorToUse = parentSetError || setError;

  useEffect(() => {
    async function fetchRecentOrders() {
      if (!userInfo?.id) return;
      if (setLoading) setLoading(true);
      setErrorToUse(null);
      try {
        const token = await getAccessTokenSilently();
        const url = endpoint.GET_TRANSACTION_BY_ID({ id: userInfo.id, limit: 4 });
        const res = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.items || res.data || [];
        setOrders(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (err) {
        setErrorToUse(err?.response?.data?.error || "Failed to fetch recent orders");
      } finally {
        if (setLoading) setLoading(false);
      }
    }
    fetchRecentOrders();
  }, [userInfo?.id, getAccessTokenSilently, setLoading, setErrorToUse]);

  return (
    <div className="mb-10">
      <div className="bg-white border rounded shadow-sm max-h-[400px] overflow-y-auto">
        {orders.length === 0 && (
          <Paragraph className="text-center text-gray-500 py-6">
            You don't have any purchases in your account right now
          </Paragraph>
        )}
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 border-b last:border-b-0 flex justify-between items-center"
          >
            <div>
              <Paragraph className="font-medium">
                {order.trandisplayname}
              </Paragraph>
              <Paragraph className="text-sm text-gray-500 mb-1">
                Placed on {order.trandate || "Unknown"}
              </Paragraph>
              {order.shipcarrier && (
                <Paragraph className="text-sm text-gray-600">
                  Carrier: {" "}
                  <span className="font-medium">{order.shipcarrier}</span>
                </Paragraph>
              )}
            </div>
            <div className="text-right">
              <Paragraph className="text-sm text-gray-600">
                {order.status}
              </Paragraph>
              {order.foreigntotal && (
                <Paragraph className="text-base font-semibold text-gray-800">
                  ${order.foreigntotal}
                </Paragraph>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
