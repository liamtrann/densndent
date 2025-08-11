import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, PreviewCartItem } from "common";
import {
  updateQuantity,
  removeFromCart,
  setItemSubscription,
} from "@/redux/slices/cartSlice";
import { formatCurrency } from "config/config";
import { selectCartSubtotalWithDiscounts } from "@/redux/slices";

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
      dispatch(
        updateQuantity({ id: item.id, flavor: item.flavor, quantity: newQty })
      );
    } else {
      dispatch(removeFromCart(item.id));
    }
  };

  const chooseOneTime = (item) => {
    dispatch(
      setItemSubscription({
        id: item.id,
        flavor: item.flavor,
        enabled: false,
        interval: null,
      })
    );
  };

  const chooseSubscribe = (item) => {
    dispatch(
      setItemSubscription({
        id: item.id,
        flavor: item.flavor,
        enabled: true,
        interval: item.subscriptionInterval || "1",
      })
    );
  };

  const changeInterval = (item, value) => {
    dispatch(
      setItemSubscription({
        id: item.id,
        flavor: item.flavor,
        enabled: true,
        interval: value,
      })
    );
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

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {cartItems.map((item) => {
          const key = `${item.id}-${item.flavor ?? "no-flavor"}`;
          const isSubbed = !!item.subscriptionEnabled;
          const interval = item.subscriptionInterval || "1";

          return (
            <div key={key} className="border-b border-gray-200 pb-3">
              <PreviewCartItem
                item={item}
                onQuantityChange={handleQtyChange}
                onItemClick={(id) => navigate(`/product/${id}`)}
                compact
                imageSize="w-12 h-12"
                textSize="text-sm"
              />

              {/* Purchase Options */}
              <fieldset className="mt-3">
                <legend className="sr-only">Purchase options</legend>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name={`purchase-${key}`}
                      checked={!isSubbed}
                      onChange={() => chooseOneTime(item)}
                      className="h-4 w-4"
                    />
                    <span>One-Time Purchase</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name={`purchase-${key}`}
                      checked={isSubbed}
                      onChange={() => chooseSubscribe(item)}
                      className="h-4 w-4"
                    />
                    <span>Subscribe &amp; Save</span>
                  </label>
                </div>
              </fieldset>

              {/* Subscription controls appear only if Subscribe is chosen */}
              {isSubbed && (
                <div className="mt-2">
                  <label
                    htmlFor={`interval-${key}`}
                    className="block text-sm mb-1 font-medium"
                  >
                    Delivery frequency
                  </label>
                  <select
                    id={`interval-${key}`}
                    value={interval}
                    onChange={(e) => changeInterval(item, e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="1">Every 1 month</option>
                    <option value="2">Every 2 months</option>
                    <option value="3">Every 3 months</option>
                    <option value="6">Every 6 months</option>
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
