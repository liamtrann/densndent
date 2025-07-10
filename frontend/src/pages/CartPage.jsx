import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { removeFromCart, addToCart } from "../redux/slices/cartSlice";
import { delayCall } from "../api/util";
import { useInventoryCheck } from "../hooks";
import { CartProductCard, CartOrderSummary } from "../components";

export default function CartPage() {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [postalCode, setPostalCode] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Inventory check hook
  const { inventoryStatus, loading: inventoryLoading, error: inventoryError, checkInventory } = useInventoryCheck();

  // Check inventory on cart load/change
  useEffect(() => {
    if (cart.length > 0) {
      checkInventory(cart.map(item => item.id));
    }
  }, [cart]);

  // Calculate subtotal and total quantity
  const subtotal = cart.reduce((sum, item) => sum + (item.unitprice || item.price || 0) * item.quantity, 0).toFixed(2);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Handle quantity change
  const handleQuantityChange = (item, value) => {
    const newQuantity = Math.max(1, Math.min(Number(value), item.totalquantityonhand || 9999));
    if (newQuantity !== item.quantity) {
      delayCall(() => dispatch(addToCart({ ...item, quantity: newQuantity - item.quantity })));
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
    const result = await checkInventory(cart.map(item => item.id));
    if (!result) return;
    // Check for out of stock or missing items
    const outOfStock = result.find(r => !r || r.quantityavailable <= 0);
    if (outOfStock) {
      alert("Some items in your cart are out of stock or unavailable. Please review your cart.");
      return;
    }
    navigate("/checkout");
  };

  console.log(inventoryStatus)

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        SHOPPING CART ({cart.length} Product{cart.length !== 1 ? "s" : ""}, {totalQuantity} Item{totalQuantity !== 1 ? "s" : ""})
      </h1>

      {/* Inventory check error/warning */}
      {inventoryError && <div className="text-red-600 text-center mb-4">{inventoryError}</div>}
      {inventoryLoading && <div className="text-blue-700 text-center mb-4">Checking inventory...</div>}

      {/* Cart Items */}
      {cart.length > 0 ? (
        cart.map((item) => {
          const inv = inventoryStatus.find(i => i.item === item.id);
          const missing = !inv;
          return (
            <div key={item.id + (item.flavor ? `-${item.flavor}` : "") + "-wrapper"}>
              <CartProductCard
                key={item.id + (item.flavor ? `-${item.flavor}` : "")}
                item={item}
                inv={inv}
                onNavigate={handleNavigateToProduct}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveClick}
              />
              {missing && (
                <div className="text-red-700 text-xs mb-2 ml-2">This item is no longer available or has been removed from inventory.</div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-center mt-6 text-sm text-blue-700 font-medium">Your cart is empty.</p>
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
              price: selectedProduct.unitprice || selectedProduct.price,
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
