import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "config/config";
import { updateQuantity, removeFromCart } from "@/redux/slices/cartSlice";
import PreviewCartItem from "./PreviewCartItem";

export default function CartIndicator() {
  const cartItems = useSelector((state) => state.cart.items);
  const [isHovered, setHovered] = useState(false);
  const closeTimeout = useRef(null); // 👈 Ref for delay timer
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current); // cancel pending close
    }
    setHovered(true);
  };

  const handleMouseLeave = () => {
    // Delay hiding
    closeTimeout.current = setTimeout(() => {
      setHovered(false);
    }, 250); // 250ms delay before hiding
  };

  const handleNavigateToProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const handleQuantityChange = (item, type) => {
    const newQuantity = type === "inc" ? item.quantity + 1 : item.quantity - 1;

    if (newQuantity === 0) {
      dispatch(removeFromCart(item.id));
    } else {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  const hasItems = cartItems.length > 0;

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cart Icon with count */}
      <Link to="/cart" className="relative">
        <FaShoppingCart className="text-xl text-orange-600 hover:text-orange-700" />
        {hasItems && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold min-w-[20px] text-center">
            {cartItems.length}
          </span>
        )}
      </Link>

      {/* Always-mounted dropdown with smooth transition */}
      <div
        className={`
          absolute right-0 top-8 w-80 bg-white shadow-xl border rounded-md z-50 p-4 space-y-3
          transition-all duration-300 ease-in-out transform
          ${
            isHovered && hasItems
              ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
              : "opacity-0 scale-95 pointer-events-none -translate-y-2"
          }
        `}
      >
        <h4 className="text-sm font-semibold mb-2">Cart Preview</h4>
        {cartItems.slice(0, 3).map((item, idx) => (
          <PreviewCartItem
            key={item.id + "-" + idx}
            item={item}
            onQuantityChange={handleQuantityChange}
            onItemClick={handleNavigateToProduct}
            showQuantityControls={true}
            compact={true}
            imageSize="w-12 h-12"
            textSize="text-sm"
          />
        ))}
        <div className="text-right">
          <Link
            to="/cart"
            className="text-blue-600 text-sm font-medium underline hover:text-blue-800"
          >
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
