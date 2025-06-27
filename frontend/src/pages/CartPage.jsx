import React, { useState } from "react";
import InputField from "../common/InputField";

export default function CartPage() {
  const [quantity, setQuantity] = useState(1);
  const [postalCode, setPostalCode] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [savedForLater, setSavedForLater] = useState(false);
  const [isInCart, setIsInCart] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const pricePerItem = 11.99;
  const subtotal = (pricePerItem * quantity).toFixed(2);

  // Handlers
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveForLater = () => {
    setSavedForLater(true);
    setIsInCart(false);
  };

  const handleRemove = () => {
    setIsInCart(false);
    setSavedForLater(false);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        SHOPPING CART ({isInCart ? "1 Product" : "0 Products"}, {quantity} Item{quantity > 1 ? "s" : ""})
      </h1>

      {/* Cart Item */}
      {isInCart && !savedForLater && (
        <div className="flex gap-6 border p-4 rounded-md shadow-sm">
          <img src="/q2/topical-anesthetic.png" alt="Product" className="h-32" />
          <div className="flex-grow">
            <h2 className="font-semibold mb-1">
              Topical Anesthetic Gel 28gm Jar Mint - D21301-M
            </h2>
            <p className="text-gray-600">${pricePerItem}</p>
            <p className="mt-2 text-sm"><span className="font-medium">Flavours:</span> Mint</p>

            <div className="mt-2 w-24">
              <InputField
                label="Quantity:"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                disabled={!isEditing}
              />
            </div>

            <p className="mt-2 text-sm">
              <span className="font-medium">Amount:</span>{" "}
              <span className="font-bold">${subtotal}</span>
            </p>

            <div className="mt-2 text-sm text-gray-600 space-x-4">
              {!isEditing ? (
                <>
                  <button className="text-blue-600 underline" onClick={handleEdit}>Edit</button>
                  <button className="text-blue-600 underline" onClick={handleSaveForLater}>Save for Later</button>
                  <button className="text-red-600 underline" onClick={handleRemove}>Remove</button>
                </>
              ) : (
                <button className="text-blue-600 underline" onClick={handleSaveEdit}>Save</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Saved for Later Message */}
      {savedForLater && (
        <p className="text-center mt-6 text-sm text-blue-700 font-medium">
          This item is saved for later.
        </p>
      )}

      {/* Order Summary */}
      {isInCart && (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2" />
          <div className="border p-6 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2 text-sm">
              <span>Subtotal {quantity} item{quantity > 1 ? "s" : ""}</span>
              <span className="font-semibold">${subtotal}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Subtotal Does Not Include Shipping Or Tax
            </p>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Estimate Tax & Shipping</h4>
              <p className="text-xs mb-2">Ship available only to Canada</p>
              <InputField
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
              <button className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800">
                ESTIMATE
              </button>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Have a Promo Code?</h4>
              <div className="flex gap-2">
                <InputField
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo Code"
                />
                <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
                  APPLY
                </button>
              </div>
            </div>

            <button className="w-full mt-4 bg-purple-800 text-white py-3 rounded hover:bg-purple-900">
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
