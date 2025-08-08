import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, PreviewCartItem } from "common";
import {
  updateQuantity,
  removeFromCart,
  setSubscriptionFrequency,
} from "@/redux/slices/cartSlice";
import { formatCurrency } from "config/config";
import {
  selectCartSubtotalWithDiscounts,
} from "@/redux/slices";

export default function CartSummaryPanel() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = useSelector((state) =>
    selectCartSubtotalWithDiscounts(state, cartItems)
  );

  if (cartItems.length === 0) return null;

  const handleQtyChange = (item, type) => {
    const newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;

    if (newQty > 0) {
      dispatch(updateQuantity({ id: item.id, flavor: item.flavor, quantity: newQty }));
    } else {
      dispatch(removeFromCart(item.id));
    }
  };

  const handleNavigateToProduct = (id) => {
    navigate(`/product/${id}`);
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

      <Button
        onClick={() => navigate("/cart")}
        className="w-full mt-2"
        variant="secondary"
      >
        Go to Cart
      </Button>

      <div className="mt-4 font-medium flex justify-between">
        <span>Subtotal:</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <h3 className="text-lg font-semibold my-3">Cart Summary</h3>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {cartItems.map((item) => (
          <div key={`${item.id}-${item.flavor || ""}`} className="border-b pb-3">
            <PreviewCartItem
              item={item}
              onQuantityChange={handleQtyChange}
              onItemClick={handleNavigateToProduct}
              compact={true}
              imageSize="w-12 h-12"
              textSize="text-sm"
            />

            {/* Subscription Dropdown per product */}
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Subscribe to this item:
              </label>
              <select
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                value={item.subscriptionFrequency || ""}
                onChange={(e) =>
                  dispatch(
                    setSubscriptionFrequency({
                      id: item.id,
                      flavor: item.flavor,
                      frequency: e.target.value,
                    })
                  )
                }
              >
                <option value="">No Subscription</option>
                <option value="1">Every 1 month</option>
                <option value="2">Every 2 months</option>
                <option value="3">Every 3 months</option>
                <option value="6">Every 6 months</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
