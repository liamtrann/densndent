import React from "react";
import Button from "../common/Button";

export default function Modal({ title, onClose, image, product, onViewCart }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg relative">
        <button onClick={onClose} className="absolute top-3 right-4 text-xl">×</button>
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <div className="flex gap-6 items-center">
          <img src={image} alt={product.name} className="h-24" />
          <div>
            <p className="font-semibold">{product.name} - {product.flavor}</p>
            <p>{product.price}</p>
            <p>Quantity: {product.quantity}</p>
          </div>
        </div>
        <div className="flex justify-end mt-6 gap-4">
          <Button variant="secondary" onClick={onClose}>Continue Shopping</Button>
          <Button onClick={onViewCart}>View Cart & Checkout</Button>
        </div>
      </div>
    </div>
  );
}
