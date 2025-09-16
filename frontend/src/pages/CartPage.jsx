import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  setItemSubscription,
} from "store/slices/cartSlice";

import { FiGrid, FiList } from "react-icons/fi";
import { formatPrice, formatCurrency } from "config/config";
import { delayCall } from "../api/util";
import { EmptyCart, ErrorMessage, Loading, Dropdown } from "../common";
import Breadcrumb from "../common/navigation/Breadcrumb";
import { ListProductInCart, Modal } from "../components";
import { CartOrderSummary } from "../components";
import { useInventoryCheck } from "../config";

import { selectCartSubtotalWithDiscounts } from "@/redux/slices";

/* =======================
   Date helpers (local-only)
   ======================= */
function formatLocalDateToronto(date) {
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/Toronto",
  });
}

export default function CartPage() {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // NEW: view toggle (grid | list)
  const [view, setView] = useState("grid");

  // Page controls
  const [showFilter, setShowFilter] = useState("all"); // all | sub | one
  const [postalCode, setPostalCode] = useState("");
  const [promoCode, setPromoCode] = useState("");

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

  useEffect(() => {
    if (cart.length > 0) {
      checkInventory(cart.map((item) => item.id));
    }
  }, [cart]); // eslint-disable-line react-hooks/exhaustive-deps

  const subtotalAmount = useSelector((state) =>
    selectCartSubtotalWithDiscounts(state, cart)
  );
  const subtotal = formatPrice(subtotalAmount);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

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

  const handleProceedToCheckout = async () => {
    const result = await checkInventory(cart.map((item) => item.id));
    if (!result) return;
    navigate("/checkout");
  };

  if (inventoryError)
    return <ErrorMessage message={inventoryError} className="mb-4" />;
  if (inventoryLoading) return <Loading />;

  return (
    <div className="mx-auto px-4 lg:px-6 py-8 max-w-7xl">
      <Breadcrumb path={["Home", "Cart"]} />

      {cart.length > 0 && (
        <h1 className="text-2xl font-bold mb-6 text-center lg:text-left">
          SHOPPING CART ({cart.length} Product{cart.length !== 1 ? "s" : ""},{" "}
          {totalQuantity} Item{totalQuantity !== 1 ? "s" : ""})
        </h1>
      )}

      {/* Toolbar row (style matches your list pages) */}
      {cart.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-4">
          {/* Segmented Grid | List */}
          <div
            role="group"
            aria-label="View switcher"
            className="inline-flex border rounded-md overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-pressed={view === "grid"}
              className={`px-3 py-2 text-sm inline-flex items-center gap-2 ${
                view === "grid"
                  ? "bg-gray-100 text-gray-900"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FiGrid size={14} />
              Grid
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              className={`px-3 py-2 text-sm inline-flex items-center gap-2 border-l ${
                view === "list"
                  ? "bg-gray-100 text-gray-900"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FiList size={14} />
              List
            </button>
          </div>

          {/* Existing “Show” filter (unchanged) */}
          <span className="text-sm font-medium ml-1">Show:</span>
          <div className="w-56">
            <Dropdown
              value={showFilter}
              onChange={(e) => setShowFilter(e.target.value)}
              options={[
                { value: "all", label: "All items" },
                { value: "sub", label: "Subscriptions" },
                { value: "one", label: "One-time purchases" },
              ]}
            />
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] items-start gap-6">
        {/* LEFT: list */}
        <div>
          <div className="lg:max-h[calc(100vh-220px)] lg:overflow-y-auto lg:pr-3 lg:pb-2 custom-scrollbar">
            {filteredCart.length > 0 ? (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                    : "flex flex-col"
                }
              >
                {filteredCart.map((item) => {
                  const key = item.id + (item.flavor ? `-${item.flavor}` : "");
                  return (
                    <ListProductInCart
                      key={`${key}-card`}
                      item={item}
                      inventoryStatus={inventoryStatus}
                      onQuantityChange={handleQuantityChange}
                      onItemClick={handleNavigateToProduct}
                      onOneTime={chooseOneTime}
                      onSubscribe={chooseSubscribe}
                      onIntervalChange={changeInterval}
                      onRemoveClick={handleRemoveClick}
                      formatLocalDateToronto={formatLocalDateToronto}
                      listType={view === "grid" ? "card" : "table"}
                    />
                  );
                })}
              </div>
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
                promoCode={promoCode}
                setPromoCode={setPromoCode}
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
          <p>Are you sure you want to remove this product from your cart?</p>
        </Modal>
      )}
    </div>
  );
}
