import React, { useState } from "react";
import { FiShoppingCart, FiEye } from "react-icons/fi"; // cart icon and eye icon for quick look
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "store/slices/cartSlice";

// import CartConfirmationModal from "../cart/CartConfirmationModal";
import { ProductImage, Paragraph, InputField, DeliveryEstimate } from "common";
import { FlexibleModal } from "components/layout";
import { useQuantityHandlers } from "config/config";

import ProductDetail from "../../pages/ProductDetail";

import ToastNotification from "@/common/toast/Toast";
import { CURRENT_IN_STOCK, OUT_OF_STOCK } from "@/constants/constant";

export default function ListProduct({ product }) {
  const { id, itemid, file_url, price, totalquantityonhand } = product;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showQuickLook, setShowQuickLook] = useState(false);
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
    <>
      <div
        className="border p-4 rounded shadow hover:shadow-md transition flex flex-col h-full group relative cursor-pointer"
        onClick={handleNavigate}
      >
        <div className="relative group/image">
          <ProductImage src={file_url} />
          {/* Quick Look Button - Centered overlay on image hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigation when clicking quick look
                setShowQuickLook(true);
              }}
              className="py-2 px-4 text-sm text-white bg-primary-blue border border-primary-blue rounded hover:bg-smiles-blue transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              <FiEye size={14} />
              Quick Look
            </button>
          </div>
        </div>

        <h3 className="text-sm font-medium text-gray-900 mb-1 hover:underline line-clamp-2 min-h-[2.5rem]">
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
            <div className="mb-2">
              <Paragraph className="text-smiles-blue font-semibold">
                {CURRENT_IN_STOCK}
              </Paragraph>
              <DeliveryEstimate inStock={true} size="small" />
            </div>
          ) : (
            <div className="mb-2">
              <Paragraph className="text-smiles-orange font-semibold">
                {OUT_OF_STOCK}
              </Paragraph>
              <DeliveryEstimate inStock={false} size="small" />
            </div>
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
          <div
            className="flex items-center border rounded overflow-hidden h-9"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                decrement();
              }}
              className="px-2 h-9 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={Number(quantity) <= 1}
            >
              –
            </button>
            <InputField
              type="number"
              min="1"
              max={999}
              value={quantity}
              onChange={handleQuantityChange}
              onClick={(e) => e.stopPropagation()}
              className="w-12 h-9 text-center text-sm border-0 focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                increment();
              }}
              className="px-2 h-9 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              +
            </button>
          </div>

          <FiShoppingCart
            size={30}
            className="text-primary-blue hover:text-smiles-blue hover:scale-150 cursor-pointer transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            aria-label="Add to cart"
          />
        </div>
      </div>

      {/* Quick Look Modal */}
      {showQuickLook && (
        <FlexibleModal
          title="Quick Look"
          onClose={() => setShowQuickLook(false)}
        >
          <ProductDetail
            productId={id}
            onAddToCart={() => setShowQuickLook(false)}
            isModal={true}
          />
        </FlexibleModal>
      )}
    </>
  );
}
