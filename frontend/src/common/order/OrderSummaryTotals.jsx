// src/common/order/OrderSummaryTotals.jsx
import React from "react";
import { formatCurrency } from "config/config";

export default function OrderSummaryTotals({ subtotal = 0, total = 0 }) {
  return (
    <div className="px-5 py-4 border-t">
      <div className="flex justify-end gap-10">
        <div className="text-sm text-gray-600">Subtotal (items shown)</div>
        <div className="text-base font-semibold text-gray-900">
          {formatCurrency(subtotal)}
        </div>
      </div>

      <div className="mt-2 flex justify-end gap-10">
        <div className="text-sm text-gray-600">Order Total</div>
        <div className="text-lg font-bold text-gray-900">
          {formatCurrency(total)}
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500 text-right">
        Note: Order Total may include tax/shipping/fees not listed above. Items
        table only shows inventory lines.
      </div>
    </div>
  );
}
