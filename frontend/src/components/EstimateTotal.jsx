import React from "react";
import { calculateTotalCurrency, formatCurrency } from "config";

export default function EstimateTotal({
  subtotal,
  shippingCost = null,
  estimatedTax = null,
  taxRate = null,
  currency = "$",
  showBreakdown = true,
  className = "",
}) {
  const shipping = shippingCost !== null ? shippingCost : 9.99;
  const tax = estimatedTax || 0;
  const total = Number(subtotal) + Number(tax) + Number(shipping);

  if (!showBreakdown) {
    return (
      <div className={`${className}`}>
        <div className="flex justify-between items-center py-2 border-t border-gray-300 text-lg font-bold">
          <span className="text-gray-800">Total</span>
          <span className="text-gray-800">
            {formatCurrency(total, currency)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Estimated Tax Row */}
      {estimatedTax !== null && (
        <div className="flex justify-between items-center py-2 border-t border-gray-200 text-base font-semibold">
          <span className="text-gray-700 flex items-center gap-2">
            Estimated Tax
            {taxRate && (
              <span className="text-xs text-gray-500">
                ({(taxRate * 100).toFixed(2)}%)
              </span>
            )}
          </span>
          <span className="text-gray-900">
            {formatCurrency(estimatedTax, currency)}
          </span>
        </div>
      )}

      {/* Shipping Row */}
      <div className="flex justify-between items-center py-2 border-t border-gray-200 text-base font-semibold">
        <span className="text-gray-700">Shipping</span>
        <span className="text-gray-900">
          {formatCurrency(shipping, currency)}
        </span>
      </div>

      {/* Estimated Total Row */}
      <div className="flex justify-between items-center py-2 border-t border-gray-300 text-lg font-bold">
        <span className="text-gray-800">
          {estimatedTax !== null ? "Estimated Total" : "Total"}
        </span>
        <span className="text-gray-800">{formatCurrency(total, currency)}</span>
      </div>
    </div>
  );
}
