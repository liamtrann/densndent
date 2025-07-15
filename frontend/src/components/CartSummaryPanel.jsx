// components/CartSummaryPanel.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { ProductImage } from "../common";
import { updateQuantity, removeFromCart } from "../redux/slices/cartSlice";

export default function CartSummaryPanel() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleIncrement = (item) => {
    dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }));
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeFromCart(item.id));
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <aside className="hidden lg:block w-80 bg-white border border-gray-200 p-4 rounded shadow sticky top-28 h-fit">
      <Button
        onClick={() => navigate("/cart")}
        className="w-full mt-4"
        variant="primary"
      >
        Go to Checkout
      </Button>

      <div className="mt-4 font-medium flex justify-between">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <h3 className="text-lg font-semibold mb-3">Cart Summary</h3>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 border-b pb-3"
          >
            <ProductImage
              src={item.file_url}
              className="w-12 h-12 object-cover"
            />
            <div className="flex flex-col text-sm flex-1">
              <span className="font-medium mb-1">{item.itemid}</span>
              <div className="flex items-center gap-2 mb-1">
                <button
                  className="px-2 border rounded hover:bg-gray-100"
                  onClick={() => handleDecrement(item)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-2 border rounded hover:bg-gray-100"
                  onClick={() => handleIncrement(item)}
                >
                  +
                </button>
              </div>
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
