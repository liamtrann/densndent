// src/common/order/OrderItemsTable.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ProductImage } from "common";
import { formatCurrency } from "config/config";

function HoverProductLink({ productId, children, name, sku, qty, rate }) {
  if (!productId) return <span className="font-medium text-gray-900">{children}</span>;

  return (
    <span className="relative inline-block group">
      <Link
        to={`/product/${productId}`}
        className="underline decoration-dotted underline-offset-2 hover:text-smiles-blue focus:outline-none focus:ring-2 focus:ring-smiles-orange rounded cursor-pointer"
        title={`${name}${sku ? ` • ${sku}` : ""}`}
        aria-label={`View ${name}`}
      >
        {children}
      </Link>

      {/* Hover card (optional) */}
      <div
        className="pointer-events-none absolute left-0 top-full mt-2 z-10 w-60 bg-white border rounded shadow px-3 py-2 text-xs text-gray-700 opacity-0 translate-y-1 transition
                   group-hover:opacity-100 group-hover:translate-y-0"
      >
        <div className="font-medium text-gray-900 truncate">{name}</div>
        {sku && <div className="text-gray-500 mt-0.5">SKU: {sku}</div>}
        <div className="mt-1 flex items-center justify-between">
          <span>
            Qty: <strong>{qty}</strong>
          </span>
          <span>
            Unit: <strong>{formatCurrency(rate)}</strong>
          </span>
        </div>
      </div>
    </span>
  );
}

export default function OrderItemsTable({ lines = [] }) {
  return (
    <table className="min-w-full text-sm">
      <thead>
        <tr className="text-left text-gray-600 border-b">
          <th className="px-5 py-3">Product Image</th>
          <th className="px-5 py-3 hidden sm:table-cell">Product Name</th>
          <th className="px-5 py-3 text-right">Qty</th>
          <th className="px-5 py-3 text-right">Unit Price</th>
          <th className="px-5 py-3 text-right">Line Total</th>
        </tr>
      </thead>
      <tbody>
        {lines.map((l, idx) => (
          <tr key={l.lineId ?? idx} className="border-b last:border-b-0">
            {/* Product Image ONLY (no link/text) */}
            <td className="px-5 py-4">
              {l.image ? (
                <ProductImage
                  src={l.image}
                  alt={l.name}
                  className="w-12 h-12 object-contain border rounded"
                />
              ) : (
                <div className="w-12 h-12 rounded border bg-gray-50" />
              )}
            </td>

            {/* Second column (still using your linked text) */}
            <td className="px-5 py-4 hidden sm:table-cell text-gray-600">
              {l.sku ? (
                <HoverProductLink
                  productId={l.productId}
                  name={l.name}
                  sku={l.sku}
                  qty={l.quantity}
                  rate={l.rate}
                >
                  {l.sku}
                </HoverProductLink>
              ) : (
                <HoverProductLink
                  productId={l.productId}
                  name={l.name}
                  qty={l.quantity}
                  rate={l.rate}
                >
                  {l.name}
                </HoverProductLink>
              )}
            </td>

            <td className="px-5 py-4 text-right">{l.quantity}</td>
            <td className="px-5 py-4 text-right">{formatCurrency(l.rate)}</td>
            <td className="px-5 py-4 text-right font-semibold">
              {formatCurrency(l.amount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
