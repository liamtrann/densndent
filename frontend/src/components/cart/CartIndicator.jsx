import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ProductImage } from "common";
import { formatCurrency } from "config/config";

export default function CartIndicator() {
  const cartItems = useSelector((state) => state.cart.items);
  const [isHovered, setHovered] = useState(false);
  const closeTimeout = useRef(null); // 👈 Ref for delay timer
  const navigate = useNavigate();

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
                {formatCurrency(item.unitprice || item.price)} each
              </div>
              {item.stockdescription && (
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-1 py-0.5 rounded inline-block mt-1">
                  {item.stockdescription}
                </span>
              )}
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
    </div>
  );
}
