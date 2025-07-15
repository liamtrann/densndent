import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi"; // cart icon
import { Button } from "../../common";
import { addToCart } from "../../redux/slices/cartSlice";
import CartConfirmationModal from "../cart/CartConfirmationModal";
import { ProductImage, Paragraph, InputField } from "../../common";

export default function ListProduct({ product }) {
  const { id, itemid, file_url, price, totalquantityonhand } = product;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    const cartItem = { ...product, quantity: Number(quantity) };
    dispatch(addToCart(cartItem));
    setShowModal(true);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (Number(value) < 1) {
      setQuantity(1);
    } else {
      setQuantity(value);
    }
  };

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };

  const increment = () => {
    setQuantity((prev) => Number(prev) + 1);
  };

  const decrement = () => {
    if (Number(quantity) > 1) {
      setQuantity((prev) => Number(prev) - 1);
    }
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
            Current Stock: {totalquantityonhand}
          </Paragraph>
        ) : (
          <Paragraph className="text-red-600 font-semibold mb-2">
            Out of stock
          </Paragraph>
        )}
      </div>

      {showModal && (
        <CartConfirmationModal
          product={product}
          quantity={Number(quantity)}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="flex justify-between items-center mt-auto">
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
