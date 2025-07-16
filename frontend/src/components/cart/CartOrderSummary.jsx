import React from "react";
import { InputField } from "common";

export default function CartOrderSummary({
  totalQuantity,
  subtotal,
  postalCode,
  setPostalCode,
  promoCode,
  setPromoCode,
  handleProceedToCheckout,
  inventoryLoading,
}) {
  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2" />
      <div className="border p-6 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <div className="flex justify-between mb-2 text-sm">
          <span>
            Subtotal {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
          </span>
          <span className="font-semibold">${subtotal}</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Subtotal Does Not Include Shipping Or Tax
        </p>
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1">Estimate Tax & Shipping</h4>
          <p className="text-xs mb-2">Ship available only to Canada</p>
          <InputField
            placeholder="Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
          <button className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800">
            ESTIMATE
          </button>
        </div>
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1">Have a Promo Code?</h4>
          <div className="flex gap-2">
            <InputField
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Promo Code"
            />
            <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
              APPLY
            </button>
          </div>
        </div>
        <button
          className="w-full mt-4 bg-purple-800 text-white py-3 rounded hover:bg-purple-900"
          onClick={handleProceedToCheckout}
          disabled={inventoryLoading}
        >
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
}
