// components/CartSummaryPanel.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { ProductImage } from "../common";

export default function CartSummaryPanel() {
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) return null;

  return (
    <aside className="hidden lg:block w-80 bg-white border border-gray-200 p-4 rounded shadow sticky top-28 h-fit">
      <Button
        onClick={() => navigate("/cart")}
        className="w-full mt-4"
        variant="primary"
      >
        Go to Checkout
      </Button>{" "}
      <div className="mt-4 font-medium flex justify-between">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <h3 className="text-lg font-semibold mb-3">Cart Summary</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 border-b pb-2">
            <ProductImage
              src={item.file_url}
              className="w-12 h-12 object-cover"
            />
            <div className="flex flex-col text-sm">
              <span className="font-medium">{item.itemid}</span>
              <span className="text-gray-500">Qty: {item.quantity}</span>
              <span className="text-gray-800 font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
