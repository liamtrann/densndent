import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { HiPlusSm, HiMinusSm } from "react-icons/hi";
import Button from "../common/Button";
import { addToCart } from "../redux/slices/cartSlice";
import CartConfirmationModal from "./CartConfirmationModal";
import { ProductImage, Paragraph } from "../common";

export default function ListProduct({ product }) {
  const { id, itemid, file_url, price, totalquantityonhand } = product;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const inStock = totalquantityonhand && totalquantityonhand > 0;

  const handleAddToCart = () => {
    const cartItem = { ...product, quantity };
    dispatch(addToCart(cartItem));
    setShowModal(true);
  };

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };

  const increaseQty = () => {
    if (inStock && quantity < totalquantityonhand) {
      setQuantity((q) => q + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
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
        <Paragraph className="text-green-700 font-semibold mb-2">
          Current Stock: {totalquantityonhand}
        </Paragraph>
      ) : (
        <Paragraph className="text-red-600 font-semibold mb-2">
          Out of stock
        </Paragraph>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center justify-center mb-3 space-x-3">
        <button
          onClick={decreaseQty}
          className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          disabled={quantity <= 1}
        >
          <HiMinusSm />
        </button>
        <span className="font-semibold w-6 text-center">{quantity}</span>
        <button
          onClick={increaseQty}
          className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          disabled={quantity >= totalquantityonhand}
        >
          <HiPlusSm />
        </button>
      </div>

      {showModal && (
        <CartConfirmationModal
          product={product}
          quantity={quantity}
          onClose={() => setShowModal(false)}
        />
      )}

      <Button
        className="w-full h-9 py-1 px-0 flex items-center justify-center rounded"
        disabled={!inStock}
        onClick={handleAddToCart}
        aria-label="Add to cart"
      >
        <FiShoppingCart size={16} />
      </Button>
    </div>
  );
}
