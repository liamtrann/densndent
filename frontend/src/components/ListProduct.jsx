import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi"; // cart icon
import Button from "../common/Button";
import { addToCart } from "../redux/slices/cartSlice";
import CartConfirmationModal from "./CartConfirmationModal";
import { ProductImage, Paragraph } from "../common";

export default function ListProduct({ product }) {
  const { id, itemid, file_url, price, totalquantityonhand } = product;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = () => {
    const cartItem = { ...product, quantity: 1 };
    dispatch(addToCart(cartItem));
    setShowModal(true);
  };

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };

  const inStock = totalquantityonhand && totalquantityonhand > 0;

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

      {showModal && (
        <CartConfirmationModal
          product={product}
          quantity={1}
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
