// src/pages/CartPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  removeFromCart,
  updateQuantity,
  setItemSubscription,
} from "store/slices/cartSlice";

import { formatPrice, formatCurrency } from "config/config";
import {
  formatLocalDateToronto,
  nextFromToday as nextSubscriptionDateFromToday,
} from "config/config";

import { delayCall } from "../api/util";
import {
  EmptyCart,
  ErrorMessage,
  Loading,
  PreviewCartItem,
  Dropdown,
  Breadcrumb,
} from "../common";
import Paragraph from "@/common/ui/Paragraph";
import { Modal } from "../components";
import CartOrderSummary from "@/components/cart/CartOrderSummary";
import CartFilterBar from "@/components/cart/CartFilterBar";
import CartItemCard from "@/components/cart/CartItemCard";
import { useInventoryCheck } from "../config";

import { selectCartSubtotalWithDiscounts } from "@/redux/slices";
import { OUT_OF_STOCK } from "@/constants/constant";

export default function CartPage() {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Page controls
  const [showFilter, setShowFilter] = useState("all"); // all | sub | one
  const [postalCode, setPostalCode] = useState("");

  // Remove modal state
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  // Subtotal with discounts
  const subtotalAmount = useSelector((state) =>
    selectCartSubtotalWithDiscounts(state, cart)
  );
  const subtotal = formatPrice(subtotalAmount);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Fast lookup for inventory by id
  const invMap = useMemo(
    () => new Map(inventoryStatus.map((i) => [i.item, i])),
    [inventoryStatus]
  );

  // Filtered list (Show dropdown)
  const filteredCart = useMemo(() => {
    if (showFilter === "sub")
      return cart.filter((i) => !!i.subscriptionEnabled);
    if (showFilter === "one") return cart.filter((i) => !i.subscriptionEnabled);
    return cart;
  }, [cart, showFilter]);

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
    navigate("/checkout");
  };

  // Inventory check error/warning
  if (inventoryError)
    return <ErrorMessage message={inventoryError} className="mb-4" />;
  if (inventoryLoading) return <Loading />;

  return (
    <div className="mx-auto px-4 lg:px-6 py-8 max-w-7xl">
      <Breadcrumb path={["Home", "Cart"]} className="mb-4" />

      {cart.length > 0 && (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-start gap-3 lg:gap-6 mb-4">
          <h1 className="text-2xl font-bold">
            SHOPPING CART ({cart.length} Product{cart.length !== 1 ? "s" : ""},{" "}
            {totalQuantity} Item{totalQuantity !== 1 ? "s" : ""})
          </h1>

          {/* Filter sits right beside the heading on large screens */}
          <CartFilterBar
            value={showFilter}
            onChange={setShowFilter}
            className="lg:ml-2"
          />
        </div>
      )}

      {/* Two-column layout: left list (scrollable on desktop) + right summary */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] items-start gap-6">
        {/* LEFT: cart list (independent vertical scroll on desktop) */}
        <div>
          <div className="lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto lg:pr-3 lg:pb-2">
            {filteredCart.length > 0 ? (
              filteredCart.map((item) => {
                const inv = invMap.get(item.id);
                const isSubbed = !!item.subscriptionEnabled;
                const interval = item.subscriptionInterval || "1";
                const firstDate = isSubbed
                  ? nextSubscriptionDateFromToday(interval)
                  : null;

                const nextDateText = isSubbed ? (
                  <>
                    <span className="font-medium">Next order:</span>{" "}
                    <span>{formatLocalDateToronto(firstDate)}</span>
                    <span className="ml-1">
                      (
                      {interval === "1"
                        ? "every 1 month"
                        : `every ${interval} months`}
                      )
                    </span>
                  </>
                ) : null;

                return (
                  <CartItemCard
                    key={item.id + (item.flavor ? `-${item.flavor}` : "")}
                    item={item}
                    inventory={inv}
                    outOfStockText={OUT_OF_STOCK}
                    isSubbed={isSubbed}
                    interval={interval}
                    nextDateText={nextDateText}
                    onQtyChange={(it, type) => handleQuantityChange(it, type)}
                    onClickItem={(id) => handleNavigateToProduct(id)}
                    onOneTime={() => chooseOneTime(item)}
                    onSubscribe={() => chooseSubscribe(item)}
                    onIntervalChange={(val) => changeInterval(item, val)}
                    onRemove={() => handleRemoveClick(item)}
                  />
                );
              })
            ) : cart.length > 0 ? (
              <div className="text-gray-500 py-8 text-center">
                No items match that filter.
              </div>
            ) : (
              <EmptyCart />
            )}
          </div>
        </div>

        {/* RIGHT: sticky Order Summary */}
        {cart.length > 0 && (
          <aside className="lg:pl-6">
            <div className="lg:sticky lg:top-6">
              <CartOrderSummary
                totalQuantity={totalQuantity}
                subtotal={subtotal}
                postalCode={postalCode}
                setPostalCode={setPostalCode}
                handleProceedToCheckout={handleProceedToCheckout}
                inventoryLoading={inventoryLoading}
              />
            </div>
          </aside>
        )}
      </div>

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
          <Paragraph>
            Are you sure you want to remove this product from your cart?
          </Paragraph>
        </Modal>
      )}
    </div>
  );
}
