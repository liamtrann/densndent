import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "common";
import { updateQuantity, removeFromCart } from "@/redux/slices/cartSlice";
import { formatCurrency } from "config/config";
import PreviewCartItem from "./PreviewCartItem";

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
      // Remove item from cart when quantity reaches 0
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
          <PreviewCartItem
            key={item.id}
            item={item}
            onQuantityChange={handleQtyChange}
            onItemClick={handleNavigateToProduct}
            compact={true}
            imageSize="w-12 h-12"
            textSize="text-sm"
          />
        ))}
      </div>
    </aside>
  );
}
