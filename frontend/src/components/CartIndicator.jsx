import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function CartIndicator() {
  const cart = useSelector((state) => state.cart.items);
  const totalProducts = cart.length;

  return (
    <Link to="/cart" className="relative">
      <FaShoppingCart className="text-xl text-orange-600 hover:text-orange-700" />
      {totalProducts > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold min-w-[20px] text-center">
          {totalProducts}
        </span>
      )}
    </Link>
  );
}
