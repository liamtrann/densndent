import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import Button from "../common/Button";
import { addToCart } from "../redux/slices/cartSlice";
import CartConfirmationModal from "./CartConfirmationModal";
import { ProductImage, Paragraph } from "../common";

export default function ListProduct({ product }) {
  const { id, itemid, file_url, price, totalquantityonhand } = product;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1); // NEW state

  const handleAddToCart = () => {
    const cartItem = { ...product, quantity };
    dispatch(addToCart(cartItem));
    setShowModal(true);
  };

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };

  const inStock = totalquantityonhand && totalquantityonhand > 0;

  const increment = () => {
    if (!totalquantityonhand || quantity >= totalquantityonhand) return;
    setQuantity(prev => prev + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-md transition">
      <div className="cursor-pointer" onClick={handleNavigate}>
        <ProductImage src={file_url} />
      </div>

      <h3
        className="text-sm font-medium text-gray-900 mb-1 cursor-pointer hover:underline"
        onClick={handleNavigate}
      >
        {itemid}
      </h3>

      <p className="font-semibold text-gray-800 mb-2">${price}</p>

      {inStock ? (
        <Paragraph className="text-green-700 font-semibold mb-1">
          Current Stock: {totalquantityonhand}
        </Paragraph>
      ) : (
        <Paragraph className="text-red-600 font-semibold mb-1">
          Out of stock
        </Paragraph>
      )}

      {/* Quantity Selector */}
      {inStock && (
        <div className="flex items-center mb-3">
          <button
            onClick={decrement}
            className="px-2 py-1 border rounded-l text-sm disabled:opacity-50"
            disabled={quantity <= 1}
          >
            –
          </button>
          <span className="px-3 py-1 border-t border-b text-sm">{quantity}</span>
          <button
            onClick={increment}
            className="px-2 py-1 border rounded-r text-sm disabled:opacity-50"
            disabled={quantity >= totalquantityonhand}
          >
            +
          </button>
        </div>
      )}

      {showModal && (
        <CartConfirmationModal
          product={product}
          quantity={quantity}
          onClose={() => setShowModal(false)}
        />
      )}

      <Button
        className="h-9 w-22 flex items-center justify-center"
        disabled={!inStock}
        onClick={handleAddToCart}
        aria-label="Add to cart"
      >
        <FiShoppingCart size={20} />
      </Button>
    </div>
  );
}
