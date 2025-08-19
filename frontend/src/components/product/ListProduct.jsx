import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi"; // cart icon
import { addToCart } from "store/slices/cartSlice";
// import CartConfirmationModal from "../cart/CartConfirmationModal";
import { ProductImage, Paragraph, InputField } from "common";
import { useQuantityHandlers } from "config/config";
import ToastNotification from "@/common/toast/Toast";

export default function ListProduct({ product }) {
  const { id, itemid, file_url, price, totalquantityonhand } = product;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [showModal, setShowModal] = useState(false);

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
    // setShowModal(true);
  };

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };

  const inStock = totalquantityonhand && totalquantityonhand > 0;

  return (
    <div className="border p-4 rounded shadow hover:shadow-md transition flex flex-col h-full">
      <div className="cursor-pointer" onClick={handleNavigate}>
        <ProductImage src={file_url} />
      </div>

      <h3
        className="text-sm font-medium text-gray-900 mb-1 cursor-pointer hover:underline line-clamp-2 min-h-[2.5rem]"
        onClick={handleNavigate}
      >
        {itemid}
      </h3>

      {product.stockdescription && (
        <div className="mb-2">
          <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
            {product.stockdescription}
          </span>
        </div>
      )}

      {/* Show promotion preview */}
      {actualQuantity > quantity && (
        <div className="mb-2 text-xs">
          <span className="text-gray-600">Selected: {quantity}</span>
          <span className="text-green-600 font-medium ml-1">
            → Total: {actualQuantity} items
          </span>
        </div>
      )}

      <div className="mb-2">
        <span className="text-xl font-bold text-gray-800">
          ${Math.floor(price)}
        </span>
        <span className="text-sm font-semibold text-gray-600 align-top">
          .{(price % 1).toFixed(2).slice(2)}
        </span>
      </div>

      <div className="flex-grow">
        {inStock ? (
          <Paragraph className="text-green-700 font-semibold mb-2">
            Current Stock
          </Paragraph>
        ) : (
          <Paragraph className="text-red-600 font-semibold mb-2">
            Out of stock
          </Paragraph>
        )}
      </div>

      {/* {showModal && (
        <CartConfirmationModal
          product={product}
          quantity={Number(quantity)}
          onClose={() => setShowModal(false)}
        />
      )} */}

      <div className="flex justify-between items-center mt-auto gap-2">
        {/* Quantity selector with decrease/increase buttons */}
        <div className="flex items-center border rounded overflow-hidden h-9">
          <button
            onClick={decrement}
            className="px-2 h-9 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={!inStock || Number(quantity) <= 1}
          >
            –
          </button>
          <InputField
            type="number"
            min="1"
            max={999}
            value={quantity}
            onChange={handleQuantityChange}
            className="w-12 h-9 text-center text-sm border-0 focus:ring-1 focus:ring-blue-500"
            disabled={!inStock}
          />
          <button
            onClick={increment}
            className="px-2 h-9 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={!inStock}
          >
            +
          </button>
        </div>

        <FiShoppingCart
          size={30}
          className={`transition-all duration-200 ${
            inStock
              ? "text-primary-blue hover:text-smiles-blue hover:scale-150 cursor-pointer"
              : "text-gray-400 cursor-not-allowed"
          }`}
          onClick={inStock ? handleAddToCart : undefined}
          aria-label="Add to cart"
        />
      </div>
    </div>
  );
}
