import React from "react";
import { useSelector } from "react-redux";
import CartSummaryPanel from "../cart/CartSummaryPanel";

export default function LayoutWithCart({ children }) {
  const cartItems = useSelector((state) => state.cart.items);
  const hasItemsInCart = cartItems && cartItems.length > 0;

  return (
    <div className="flex">
      {/* Main Content Area */}
      <div className="flex-1 min-w-0">{children}</div>

      {/* Right Sidebar - Cart Summary - Only show if cart has items */}
      {hasItemsInCart && (
        <div className="hidden lg:block w-[300px] xl:w-[320px] shrink-0 mr-4 min-w-[250px]">
          <CartSummaryPanel />
        </div>
      )}
    </div>
  );
}
