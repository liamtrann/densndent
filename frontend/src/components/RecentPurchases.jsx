// components/profile/RecentPurchases.jsx
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../api/api";
import endpoint from "../api/endpoints";
import Paragraph from "../common/Paragraph";
import Loading from "../common/Loading";
import { ErrorMessage } from "../common";

export default function RecentPurchases() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecentOrders() {
      if (!user?.email) return;
      setLoading(true);
      setError(null);
      try {
        const token = await getAccessTokenSilently();
        // Add limit=4 to the endpoint if supported, otherwise filter after fetch
        const url = endpoint.GET_TRANSACTION_BY_EMAIL({ email: user.email, limit: 4 });
        const res = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.items || res.data || [];
        setOrders(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to fetch recent orders");
      } finally {
        setLoading(false);
      }
    }
    fetchRecentOrders();
  }, [user?.email, getAccessTokenSilently]);

  return (
    <div className="mb-10">
      <div className="bg-white border rounded shadow-sm max-h-[400px] overflow-y-auto">
        {loading && <Loading className="text-center py-6" />}
        {error && <ErrorMessage message={error} className="text-center py-6" />}
        {!loading && orders.length === 0 && (
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
      </div>
    </div>
  );
}
