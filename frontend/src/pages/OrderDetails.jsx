// src/pages/OrderDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useSelector } from "react-redux";

import api from "api/api";
import endpoint from "api/endpoints";
import {
  Breadcrumb,
  Loading,
  ErrorMessage,
  Paragraph,
  TextButton,
  ProductImage,
} from "common";
import { formatCurrency } from "config/config";

/* ===== helpers ===== */
const pick = (...vals) =>
  vals.find((v) => v !== undefined && v !== null && v !== "");
const toNum = (v) => {
  if (v === undefined || v === null) return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const n = parseFloat(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

function normalizeLine(row) {
  // Some SuiteQL rows return negatives for SO lines. Make everything display-positive.
  const rawQty = toNum(
    pick(row.total_quantity, row.quantity, row.qty, row.custcol_quantity, 0)
  );
  const qty = Math.abs(rawQty);

  const rawRate = toNum(
    pick(row.rate, row.unitprice, row.price, row.rateamount, 0)
  );
  const rate = Math.abs(rawRate);

  const rawAmount = toNum(
    pick(row.netamount, row.rateamount, row.amount, qty * rate)
  );
  const amount = Math.abs(rawAmount);

  return {
    lineId:
      pick(row.line, row.linenumber, row.lineId, row.seq) ?? Math.random(),
    sku: pick(row.itemid, row.itemId, row.item_id, row.sku, ""),
    name: pick(
      row.itemname,
      row.item_displayname,
      row.displayname,
      row.itemid,
      row.name,
      "Item"
    ),
    quantity: qty,
    rate,
    amount,
    image: pick(row.file_url, row.image, row.thumbnail, row.fileurl, ""),
  };
}

export default function OrderDetails() {
  const { transactionId } = useParams();
  const { state } = useLocation(); // from ListOrdersHistory
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const userId = useSelector((s) => s.user.info?.id);

  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Best-available summary values passed from the list page
  const summary = state?.orderSummary || {};

  useEffect(() => {
    let mounted = true;
    if (!transactionId || !userId) return;

    (async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const token = await getAccessTokenSilently();
        const url = endpoint.GET_ORDER_DETAILS_BY_TRANSACTION({
          transactionId,
          userId,
        });
        const res = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const rows = res.data?.items || res.data || [];
        const normalized = rows.map(normalizeLine);
        if (mounted) setLines(normalized);
      } catch (err) {
        if (mounted) {
          setLoadError(
            err?.response?.data?.error ||
              err?.message ||
              "Failed to load order details"
          );
          setLines([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [transactionId, userId, getAccessTokenSilently]);

  const subtotal = useMemo(
    () => round2(lines.reduce((sum, l) => sum + toNum(l.amount), 0)),
    [lines]
  );

  // Prefer header total from the order (it may include shipping/tax/fees).
  const orderTotal = useMemo(
    () =>
      toNum(
        pick(
          summary.totalAfterDiscount,
          summary.foreigntotal,
          summary.total,
          subtotal // fallback
        )
      ),
    [summary, subtotal]
  );

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

      {/* Header summary */}
      <div className="bg-white border rounded shadow-sm p-5 mb-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="text-sm">
            <div className="text-gray-500">Order ID</div>
            <div className="font-medium text-gray-900">{transactionId}</div>
          </div>
          <div className="text-sm">
            <div className="text-gray-500">Placed on</div>
            <div className="font-medium text-gray-900">
              {summary.trandate || "—"}
            </div>
          </div>
          <div className="text-sm">
            <div className="text-gray-500">Status</div>
            <div className="font-medium text-gray-900">
              {summary.status || "—"}
            </div>
          </div>
          <div className="text-sm">
            <div className="text-gray-500">Carrier</div>
            <div className="font-medium text-gray-900">
              {summary.shipcarrier || "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loading text="Loading order details..." />
      ) : loadError ? (
        <ErrorMessage message={loadError} />
      ) : lines.length === 0 ? (
        <div className="bg-white border rounded shadow-sm p-6">
          <Paragraph className="text-gray-600">
            No line items found for this order.
          </Paragraph>
        </div>
      ) : (
        <>
          <div className="bg-white border rounded shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b font-semibold text-gray-800">
              Items
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="px-5 py-3">Product</th>
                    <th className="px-5 py-3 hidden sm:table-cell">SKU</th>
                    <th className="px-5 py-3 text-right">Qty</th>
                    <th className="px-5 py-3 text-right">Unit Price</th>
                    <th className="px-5 py-3 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l, idx) => (
                    <tr
                      key={l.lineId ?? idx}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {l.image ? (
                            <ProductImage
                              src={l.image}
                              alt={l.name}
                              className="w-12 h-12 object-contain border rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded border bg-gray-50" />
                          )}
                          <div className="font-medium text-gray-900">
                            {l.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell text-gray-600">
                        {l.sku || "—"}
                      </td>
                      <td className="px-5 py-4 text-right">{l.quantity}</td>
                      <td className="px-5 py-4 text-right">
                        {formatCurrency(l.rate)}
                      </td>
                      <td className="px-5 py-4 text-right font-semibold">
                        {formatCurrency(l.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer sums */}
            <div className="px-5 py-4 border-t">
              <div className="flex justify-end gap-10">
                <div className="text-sm text-gray-600">
                  Subtotal (items shown)
                </div>
                <div className="text-base font-semibold text-gray-900">
                  {formatCurrency(subtotal)}
                </div>
              </div>

              <div className="mt-2 flex justify-end gap-10">
                <div className="text-sm text-gray-600">Order Total</div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(orderTotal)}
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500 text-right">
                Note: Order Total may include tax/shipping/fees not listed
                above. Items table only shows inventory lines.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
