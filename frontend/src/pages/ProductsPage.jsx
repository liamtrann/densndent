import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import InputField from "../common/InputField";
import Paragraph from "../common/Paragraph";
import Dropdown from "../common/Dropdown";
import Image from "../common/Image";
import Modal from "../components/Modal"; // You’ll create this component

export default function ProductsPage() {
  const [quantity, setQuantity] = useState(1);
  const [flavor, setFlavor] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    setShowModal(true);
    // Optional: Save to global/cart context here
  };

  const handleViewCart = () => {
    navigate("/cart");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Image
          src="/q2/topical-anesthetic.png"
          alt="Topical Anesthetic"
          className="w-full object-contain"
        />

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            D2: Topical Anesthetic Gel 28gm Jar - D21301
          </h2>
          <Paragraph className="text-green-700 font-semibold">IN STOCK</Paragraph>
          <Paragraph className="text-2xl font-semibold mt-2">$11.99</Paragraph>
          <Paragraph className="text-sm text-gray-600 mt-1">BUY 3 GET 1 FREE</Paragraph>


          <div className="mt-4">
            <label className="block mb-1 font-medium">Flavours:</label>
            <Dropdown
              options={["Mint", "Cherry", "Bubblegum"]}
              value={flavor}
              onChange={(e) => setFlavor(e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block mb-1 font-medium">Quantity:</label>
            <InputField
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="px-2 py-1 w-24"
            />
          </div>

          <Button className="mt-6 w-full" onClick={handleAddToCart}>
            Add to Shopping Cart
          </Button>

          <div className="text-sm text-gray-500 mt-4">
            MPN: D21301 | SKU: TA-GEL
          </div>
        </div>
      </div>

      {/* ✅ Modal for cart confirmation */}
      {showModal && (
        <Modal
          title="Added to Cart"
          onClose={() => setShowModal(false)}
          image={null}
          product={[{
            name: "Topical Anesthetic Gel 28gm Jar",
            price: "$11.99",
            flavor,
            quantity,
          }]}
          onSubmit={handleViewCart}
          onCloseText="Continue Shopping"
          onSubmitText="View Cart"
        />
      )}
    </div>
  );
}
