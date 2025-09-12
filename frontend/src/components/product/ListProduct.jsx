//ListProduct.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "store/slices/cartSlice";

import { useQuantityHandlers } from "config/config";

import ProductInListGrid from "./ProductInListGrid";
import ProductInListRow from "./ProductInListRow";

import ToastNotification from "@/common/toast/Toast";

export default function ListProduct({ product, listType = "grid" }) {
  const { id, itemid } = product;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showQuickLook, setShowQuickLook] = useState(false);
  const [quickLookProductId, setQuickLookProductId] = useState(null);

  // Use reusable quantity handlers with Buy X Get Y logic
  const {
    quantity,
    actualQuantity,
    handleQuantityChange,
    increment,
    decrement,
  } = useQuantityHandlers(1, product?.stockdescription);

  const handleAddToCart = () => {
    // Use actualQuantity which includes Buy X Get Y bonus
    const cartItem = { ...product, quantity: Number(actualQuantity) };
    dispatch(addToCart(cartItem));

    // Show success toast notification
    ToastNotification.success(`Added ${actualQuantity} ${itemid} to cart!`);
  };

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };

  const handleQuickLook = (productId) => {
    setQuickLookProductId(productId);
    setShowQuickLook(true);
  };

  const handleCloseQuickLook = () => {
    setShowQuickLook(false);
    setQuickLookProductId(null);
  };

  // If listType is "grid", render the grid layout
  if (listType === "grid") {
    return (
      <ProductInListGrid
        product={product}
        quantity={quantity}
        actualQuantity={actualQuantity}
        handleQuantityChange={handleQuantityChange}
        increment={increment}
        decrement={decrement}
        handleAddToCart={handleAddToCart}
        handleNavigate={handleNavigate}
        showQuickLook={showQuickLook}
        setShowQuickLook={setShowQuickLook}
      />
    );
  }

  // For listType === "list", render using ProductListRows
  return (
    <ProductInListRow
      product={product}
      quantity={quantity}
      actualQuantity={actualQuantity}
      handleQuantityChange={handleQuantityChange}
      increment={increment}
      decrement={decrement}
      handleAddToCart={handleAddToCart}
      handleNavigate={handleNavigate}
      showQuickLook={showQuickLook}
      quickLookProductId={quickLookProductId}
      handleQuickLook={handleQuickLook}
      handleCloseQuickLook={handleCloseQuickLook}
    />
  );
}
