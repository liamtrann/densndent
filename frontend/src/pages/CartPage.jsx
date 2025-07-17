// src/pages/CartPage.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components";
import { delayCall } from "../api/util";
import { useInventoryCheck, fetchRegionByPostalCode } from "../config";
import { CartProductCard, CartOrderSummary } from "../components";
import { ErrorMessage, Loading } from "../common";
import { addToCart, removeFromCart } from "store/slices/cartSlice";
import axios from "axios";

export default function CartPage() {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [postalCode, setPostalCode] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [regionInfo, setRegionInfo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
  }, [cart]);

  const subtotal = cart.reduce((sum, item) => sum + (item.unitprice || item.price || 0) * item.quantity, 0).toFixed(2);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleEstimate = async () => {
    try {
      const cleanedPostalCode = postalCode.replace(/\s/g, "").toUpperCase();
      const fsa = cleanedPostalCode.substring(0, 3);
      console.log("📮 Postal Code Input:", postalCode);
      console.log("🔎 FSA (First 3 characters):", fsa);

      const result = await axios.get(`https://api.zippopotam.us/ca/${fsa}`);
      const data = result.data;

      if (!data || !data.places || data.places.length === 0) {
        alert("Invalid postal code or failed to fetch region info.");
        setRegionInfo(null);
      } else {
        const province = data.places[0].state;
        console.log("📦 Estimated Province:", province);
        setRegionInfo({
          fsa,
          province,
          raw: data,
        });
      }
    } catch (error) {
      console.error("❌ Failed to fetch region info:", error);
      alert("Failed to fetch region info.");
      setRegionInfo(null);
    }
  };

  const handleProceedToCheckout = async () => {
    const result = await checkInventory(cart.map((item) => item.id));
    if (!result) return;
    const outOfStock = result.find((r) => !r || r.quantityavailable <= 0);
    if (outOfStock) {
      alert("Some items in your cart are out of stock or unavailable. Please review your cart.");
      return;
    }
    navigate("/checkout");
  };

  const handleQuantityChange = (item, value) => {
    const newQuantity = Math.max(1, Math.min(Number(value), item.totalquantityonhand || 9999));
    if (newQuantity !== item.quantity) {
      delayCall(() =>
        dispatch(addToCart({ ...item, quantity: newQuantity - item.quantity }))
      );
    }
  };

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

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        SHOPPING CART ({cart.length} Product{cart.length !== 1 ? "s" : ""},{" "}
        {totalQuantity} Item{totalQuantity !== 1 ? "s" : ""})
      </h1>

      {cart.length > 0 ? (
        cart.map((item) => {
          const inv = inventoryStatus.find((i) => i.item === item.id);
          return (
            <div key={item.id + (item.flavor ? `-${item.flavor}` : "") + "-wrapper"}>
              <CartProductCard
                item={item}
                inv={inv}
                onNavigate={() => navigate(`/product/${item.id}`)}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveClick}
              />
            </div>
          );
        })
      ) : (
        <p className="text-center mt-6 text-sm text-blue-700 font-medium">
          Your cart is empty.
        </p>
      )}

      {modalOpen && selectedProduct && (
        <Modal
          title="Remove Product"
          onClose={handleCancelRemove}
          onSubmit={handleConfirmRemove}
          onCloseText="Cancel"
          onSubmitText="Remove"
          image={selectedProduct.file_url}
          product={[{
            name: selectedProduct.displayname || selectedProduct.itemid,
            price: selectedProduct.unitprice || selectedProduct.price,
            quantity: selectedProduct.quantity,
          }]}
        >
          <p>Are you sure you want to remove this product from your cart?</p>
        </Modal>
      )}

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
          onEstimateClick={handleEstimate}
          regionInfo={regionInfo}
        />
      )}
    </div>
  );
}
