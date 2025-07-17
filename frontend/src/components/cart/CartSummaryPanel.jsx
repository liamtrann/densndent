import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, ProductImage } from "common";
import { updateQuantity, removeFromCart } from "@/redux/slices/cartSlice";
import { formatCurrency, calculateTotalCurrency } from "config/config";

export default function CartSummaryPanel() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) return null;

  const handleQtyChange = (item, type) => {
    const newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
    if (newQty > 0) {
      dispatch(updateQuantity({ id: item.id, quantity: newQty }));
    } else {
      dispatch(removeFromCart(item.id));
    }
  };

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
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <h3 className="text-lg font-semibold my-3">Cart Summary</h3>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-start gap-3 border-b pb-2">
            <ProductImage
              src={item.file_url}
              className="w-12 h-12 object-cover"
            />
            <div className="flex-1 text-sm">
              <div className="font-medium">{item.itemid}</div>
              {item.stockdescription && (
                <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded inline-block mt-1 mb-1">
                  {item.stockdescription}
                </span>
              )}
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => handleQtyChange(item, "dec")}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQtyChange(item, "inc")}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <div className="text-gray-800 font-semibold mt-1">
                {calculateTotalCurrency(item.price, item.quantity)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
