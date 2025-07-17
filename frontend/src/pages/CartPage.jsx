import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components";
import { delayCall } from "../api/util";
import { useInventoryCheck } from "../config";
import { CartOrderSummary } from "../components";
import { ErrorMessage, Loading } from "../common";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
} from "store/slices/cartSlice";
import { formatPrice, formatCurrency } from "config/config";
import {
  calculatePriceAfterDiscount,
  selectFinalPrice,
  selectCartSubtotalWithDiscounts,
} from "@/redux/slices";
import PreviewCartItem from "../components/cart/PreviewCartItem";

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

  // Calculate subtotal with discounted prices
  const subtotalAmount = useSelector((state) =>
    selectCartSubtotalWithDiscounts(state, cart)
  );
  const subtotal = formatPrice(subtotalAmount);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Handle quantity change
  const handleQuantityChange = (item, type) => {
    const newQuantity = type === "inc" ? item.quantity + 1 : item.quantity - 1;

    if (newQuantity === 0) {
      dispatch(removeFromCart(item.id));
    } else {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  // Handle remove
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

  // Check inventory before checkout
  const handleProceedToCheckout = async () => {
    const result = await checkInventory(cart.map((item) => item.id));
    if (!result) return;
    // Check for out of stock or missing items
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
          return (
            <div
              key={
                item.id + (item.flavor ? `-${item.flavor}` : "") + "-wrapper"
              }
              className="mb-4"
            >
              <PreviewCartItem
                key={item.id + (item.flavor ? `-${item.flavor}` : "")}
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
              <button
                onClick={() => handleRemoveClick(item)}
                className="text-red-600 text-sm underline mt-2 hover:text-red-800"
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
