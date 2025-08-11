import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components";
import { delayCall } from "../api/util";
import { useInventoryCheck } from "../config";
import { CartOrderSummary } from "../components";
import { ErrorMessage, Loading, PreviewCartItem } from "../common";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  setItemSubscription, // ✅ per-item subscription
} from "store/slices/cartSlice";
import { formatPrice, formatCurrency } from "config/config";
import { selectCartSubtotalWithDiscounts } from "@/redux/slices";

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
  }, [cart]);

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
      // pass flavor if you use variants
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
      <h1 className="text-2xl font-bold mb-6 text-center">
        SHOPPING CART ({cart.length} Product{cart.length !== 1 ? "s" : ""},{" "}
        {totalQuantity} Item{totalQuantity !== 1 ? "s" : ""})
      </h1>

      {/* Cart Items */}
      {cart.length > 0 ? (
        cart.map((item) => {
          const inv = inventoryStatus.find((i) => i.item === item.id);
          const key = item.id + (item.flavor ? `-${item.flavor}` : "");
          const isSubbed = !!item.subscriptionEnabled;
          const interval = item.subscriptionInterval || "1";

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

              {/* Subscription frequency (visible only if Subscribe is selected) */}
              {isSubbed && (
                <div className="mt-2">
                  <label
                    htmlFor={`sub-${key}`}
                    className="block text-sm mb-1 font-medium"
                  >
                    Delivery frequency
                  </label>
                  <select
                    id={`sub-${key}`}
                    value={interval}
                    onChange={(e) => changeInterval(item, e.target.value)}
                    className="w-64 border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="1">Every 1 month</option>
                    <option value="2">Every 2 months</option>
                    <option value="3">Every 3 months</option>
                    <option value="6">Every 6 months</option>
                  </select>
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
        <p className="text-center mt-6 text-sm text-blue-700 font-medium">
          Your cart is empty.
        </p>
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
