// /components/modals/CartConfirmationModal.jsx
import React from "react";
import Modal from "../layout/Modal";

import { useNavigate } from "react-router-dom";

export default function CartConfirmationModal({ product, quantity, onClose }) {
  const navigate = useNavigate();

  if (!product) return null;

  return (
    <Modal
      title="Added to Cart"
      onClose={onClose}
      image={product.file_url}
      product={[
        {
          name: product.displayname || product.itemid,
          price: product.price,
          stockdescription: product.stockdescription,
          quantity,
        },
      ]}
      onSubmit={() => {
        onClose();
        navigate("/cart");
      }}
      onCloseText="Continue Shopping"
      onSubmitText="View Cart"
    />
  );
}
