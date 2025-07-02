import React from "react";
import Button from "../common/Button";
import { ProductSummary } from "../common";

export default function Modal({ title, onClose, image, product = [], onSubmit, onCloseText = "Close", onSubmitText = "Submit" }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-3 right-4 text-xl">×</button>
        )}
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        {Array.isArray(product) && product.length > 0 && (
          <div className="space-y-4 mb-4">
            {product.map((item, idx) => (
              <ProductSummary key={idx} image={image} product={item} />
            ))}
          </div>
        )}
        {(onClose || onSubmit) && (
          <div className="flex justify-end mt-6 gap-4">
            {onClose && <Button variant="secondary" onClick={onClose}>{onCloseText}</Button>}
            {onSubmit && <Button onClick={onSubmit}>{onSubmitText}</Button>}
          </div>
        )}
      </div>
    </div>
  );
}
