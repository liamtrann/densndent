import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";
import { ProductImage } from "../common";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import CartConfirmationModal from "./CartConfirmationModal";


export default function ListProduct({ product }) {
  const { itemid, file_url, price } = product;
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = () => {
    const cartItem = { ...product, quantity: 1 };
    dispatch(addToCart(cartItem));
    setShowModal(true);
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-md transition">
      <ProductImage src={file_url} />
      <h3 className="text-sm font-medium text-gray-900 mb-1">{itemid}</h3>
      <p className="font-semibold text-gray-800 mb-2">${price}</p>

      <Button onClick={handleAddToCart} className="w-full mb-2 text-sm font-semibold uppercase tracking-wide">
        ADD TO SHOPPING CART
      </Button>

      <label className="text-sm flex items-center space-x-2">
        <input type="checkbox" />
        <span>Add to compare</span>
      </label>

      {showModal && (
        <CartConfirmationModal
          product={product}
          quantity={1}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
