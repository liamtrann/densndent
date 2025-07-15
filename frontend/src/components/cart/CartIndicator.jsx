// src/components/CartIndicator.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ProductImage } from "../../common";

export default function CartIndicator() {
  const cartItems = useSelector((state) => state.cart.items);
  const [isHovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cart Icon with count */}
      <Link to="/cart" className="relative">
        <FaShoppingCart className="text-xl text-orange-600 hover:text-orange-700" />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold min-w-[20px] text-center">
            {cartItems.length}
          </span>
        )}
      </Link>

      {/* Cart Preview Dropdown */}
      {isHovered && cartItems.length > 0 && (
        <div className="absolute right-0 top-8 w-80 bg-white shadow-lg border rounded-md z-50 p-4 space-y-3">
          <h4 className="text-sm font-semibold mb-2">Cart Preview</h4>
          {cartItems.slice(0, 3).map((item, idx) => (
            <div
              key={item.id + "-" + idx}
              className="flex gap-3 items-start hover:bg-gray-50 p-2 rounded transition cursor-pointer"
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <ProductImage
                src={item.file_url || item.img1}
                className="w-12 h-12 object-contain border rounded"
              />
              <div className="text-sm">
                <div className="font-medium text-blue-700 hover:underline">
                  {item.displayname || item.itemid}
                </div>
                <div>Qty: {item.quantity}</div>
                <div className="text-gray-500 text-xs">
                  ${item.unitprice || item.price} each
                </div>
              </div>
            </div>
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
      )}
    </div>
  );
}
