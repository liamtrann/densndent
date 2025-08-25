// src/pages/CartPage.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  setItemSubscription, // ✅ per-item subscription
} from "store/slices/cartSlice";

import { formatPrice, formatCurrency } from "config/config";

import { delayCall } from "../api/util";
import { EmptyCart, ErrorMessage, Loading, PreviewCartItem } from "../common";
import PurchaseOptions from "../common/ui/PurchaseOptions";
import { Modal } from "../components";
import { CartOrderSummary } from "../components";
import { useInventoryCheck } from "../config";

import { selectCartSubtotalWithDiscounts } from "@/redux/slices";

// ✅ Reuse the shared purchase control

/* =======================
   Date helpers (local-only)
   ======================= */

// Add months safely: if target month has fewer days (e.g., adding 1 month to Jan 31),
// clamp to the last day of the target month.
function addMonthsSafe(date, months) {
  const d = new Date(date.getTime());
  const day = d.getDate();
  const targetMonth = d.getMonth() + months;
  const targetYear = d.getFullYear() + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;

  // move to first day of target month, then clamp day
  const endDay = daysInMonth(targetYear, normalizedMonth);
  const clampedDay = Math.min(day, endDay);
  const res = new Date(d);
  res.setFullYear(targetYear, normalizedMonth, clampedDay);
  return res;
}

function daysInMonth(year, monthIndex) {
  // monthIndex: 0-11
  return new Date(year, monthIndex + 1, 0).getDate();
}

function formatLocalDateToronto(date) {
  // Always render in America/Toronto
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/Toronto",
  });
}

function nextSubscriptionDateFromToday(intervalStr) {
  const interval = parseInt(intervalStr || "1", 10);
  const todayToronto = new Date(); // We format with TZ; JS Date holds UTC internally
  const next = addMonthsSafe(todayToronto, isNaN(interval) ? 1 : interval);
  return next;
}

export default function CartPage() {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [postalCode, setPostalCode] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Inventory check hook
  const {
    inventoryStatus,
    loading: inventoryLoading,
    error: inventoryError,
    checkInventory,
  } = useInventoryCheck();

  // Check inventory on cart load/change
  useEffect(() => {
    if (cart.length > 0) {
      checkInventory(cart.map((item) => item.id));
    }
  }, [cart]); // eslint-disable-line react-hooks/exhaustive-deps

  // Subtotal with discounts
  const subtotalAmount = useSelector((state) =>
    selectCartSubtotalWithDiscounts(state, cart)
  );
  const subtotal = formatPrice(subtotalAmount);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Quantity change
  const handleQuantityChange = (item, type) => {
    const newQuantity = type === "inc" ? item.quantity + 1 : item.quantity - 1;

    if (newQuantity === 0) {
      dispatch(removeFromCart(item.id));
    } else {
      dispatch(
        updateQuantity({
          id: item.id,
          flavor: item.flavor,
          quantity: newQuantity,
        })
      );
    }
  };

  // Remove item
  const handleRemoveClick = (item) => {
    setSelectedProduct(item);
    setModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (selectedProduct) {
      delayCall(() => dispatch(removeFromCart(selectedProduct.id)));
      setModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleCancelRemove = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleNavigateToProduct = (id) => {
    navigate(`/product/${id}`);
  };

  // Purchase option helpers (per item)
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

  // Proceed to checkout w/ inventory guard
  const handleProceedToCheckout = async () => {
    const result = await checkInventory(cart.map((item) => item.id));
    if (!result) return;
    const outOfStock = result.find((r) => !r || r.quantityavailable <= 0);
    if (outOfStock) {
      alert(
        "Some items in your cart are out of stock or unavailable. Please review your cart."
      );
      return;
    }
    navigate("/checkout");
  };

  // Inventory check error/warning
  if (inventoryError)
    return <ErrorMessage message={inventoryError} className="mb-4" />;
  if (inventoryLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {cart.length > 0 && (
        <h1 className="text-2xl font-bold mb-6 text-center">
          SHOPPING CART ({cart.length} Product{cart.length !== 1 ? "s" : ""},{" "}
          {totalQuantity} Item{totalQuantity !== 1 ? "s" : ""})
        </h1>
      )}

      {/* Cart Items */}
      {cart.length > 0 ? (
        cart.map((item) => {
          const inv = inventoryStatus.find((i) => i.item === item.id);
          const key = item.id + (item.flavor ? `-${item.flavor}` : "");
          const isSubbed = !!item.subscriptionEnabled;
          const interval = item.subscriptionInterval || "1";

          // ⏱️ First subscription delivery date (if subscribed)
          const firstDeliveryDate = isSubbed
            ? nextSubscriptionDateFromToday(interval)
            : null;

          return (
            <div key={`${key}-wrapper`} className="mb-6 border-b pb-4">
              <PreviewCartItem
                key={key}
                item={item}
                onQuantityChange={handleQuantityChange}
                onItemClick={handleNavigateToProduct}
                showQuantityControls={true}
                showTotal={true}
                compact={false}
                imageSize="w-24 h-24"
                textSize="text-base"
              />

              {inv && inv.quantityavailable <= 0 && (
                <div className="text-red-600 text-sm mt-2">Out of stock</div>
              )}

              {/* ✅ Reusable Purchase Options */}
              <PurchaseOptions
                name={key}
                isSubscribed={isSubbed}
                interval={interval}
                onOneTime={() => chooseOneTime(item)}
                onSubscribe={() => chooseSubscribe(item)}
                onIntervalChange={(val) => changeInterval(item, val)}
              />

              {/* ✅ Subscription start date preview */}
              {isSubbed && (
                <div className="mt-2 text-xs text-gray-600">
                  <span className="font-medium">Next order:</span>{" "}
                  <span>{formatLocalDateToronto(firstDeliveryDate)}</span>
                  <span className="ml-1">
                    (
                    {interval === "1"
                      ? "every 1 month"
                      : `every ${interval} months`}
                    )
                  </span>
                </div>
              )}

              <button
                onClick={() => handleRemoveClick(item)}
                className="block text-red-600 text-sm underline mt-3 hover:text-red-800"
              >
                Remove from cart
              </button>
            </div>
          );
        })
      ) : (
        <EmptyCart />
      )}

      {/* Remove Confirmation Modal */}
      {modalOpen && selectedProduct && (
        <Modal
          title="Remove Product"
          onClose={handleCancelRemove}
          onSubmit={handleConfirmRemove}
          onCloseText="Cancel"
          onSubmitText="Remove"
          image={selectedProduct.file_url}
          product={[
            {
              name: selectedProduct.displayname || selectedProduct.itemid,
              price: formatCurrency(
                selectedProduct.unitprice || selectedProduct.price
              ),
              quantity: selectedProduct.quantity,
            },
          ]}
        >
          <p>Are you sure you want to remove this product from your cart?</p>
        </Modal>
      )}

      {/* Order Summary */}
      {cart.length > 0 && (
        <CartOrderSummary
          totalQuantity={totalQuantity}
          subtotal={subtotal}
          postalCode={postalCode}
          setPostalCode={setPostalCode}
          promoCode={promoCode}
          setPromoCode={setPromoCode}
          handleProceedToCheckout={handleProceedToCheckout}
          inventoryLoading={inventoryLoading}
        />
      )}
    </div>
  );
}
