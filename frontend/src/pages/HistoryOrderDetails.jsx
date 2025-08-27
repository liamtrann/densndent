// src/pages/OrderDetails.jsx
import { useAuth0 } from "@auth0/auth0-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import {
  Breadcrumb,
  Loading,
  ErrorMessage,
  Paragraph,
  TextButton,
  StatusBadge,
} from "common";
import {
  computeLinesSubtotal,
  computeOrderTotalFromSummary,
} from "config/config";

import OrderItemsTable from "../common/order/OrderItemsTable";
import OrderMetaGrid from "../common/order/OrderMetaGrid";
import OrderSummaryTotals from "../common/order/OrderSummaryTotals";
import useOrderDetails from "../hooks/useOrderDetails";

export default function OrderDetails() {
  const { transactionId } = useParams();
  const { state } = useLocation(); // { orderSummary } from list page (may be undefined on hard refresh)
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const userId = useSelector((s) => s.user.info?.id);

  const { lines, loading, error } = useOrderDetails({
    transactionId,
    userId,
    getAccessTokenSilently,
  });

  const summary = state?.orderSummary || {};
  const subtotal = useMemo(() => computeLinesSubtotal(lines), [lines]);
  const orderTotal = useMemo(
    () => computeOrderTotalFromSummary(summary, subtotal),
    [summary, subtotal]
  );

  const headerFields = [
    { label: "Order ID", value: transactionId },
    { label: "Placed on", value: summary.trandate || "—" },
    {
      label: "Status",
      value: summary.status ? (
        <StatusBadge status={summary.status} showDescription={false} />
      ) : (
        "—"
      ),
    },
    { label: "Carrier", value: summary.shipcarrier || "—" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Breadcrumb
        path={["Home", "Profile", "Purchase History", "Order Details"]}
      />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {summary.trandisplayname ||
            summary.tranid ||
            `Order #${transactionId}`}
        </h2>
        <TextButton onClick={() => navigate(-1)}>
          ← Back to Purchase History
        </TextButton>
      </div>

      <OrderMetaGrid items={headerFields} />

      {loading ? (
        <Loading text="Loading order details..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : lines.length === 0 ? (
        <div className="bg-white border rounded shadow-sm p-6">
          <Paragraph className="text-gray-600">
            No line items found for this order.
          </Paragraph>
        </div>
      ) : (
        <div className="bg-white border rounded shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b font-semibold text-gray-800">
            Items
          </div>
          <div className="overflow-x-auto">
            <OrderItemsTable lines={lines} />
          </div>
          <OrderSummaryTotals subtotal={subtotal} total={orderTotal} />
        </div>
      )}
    </div>
  );
}
