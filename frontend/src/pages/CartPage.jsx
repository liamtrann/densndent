import React, { useEffect } from "react";
import authApi, { setupAuthApiInterceptors } from "../api/authApi";
import { useAuth0 } from "@auth0/auth0-react";

export default function CartPage() {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    setupAuthApiInterceptors(getAccessTokenSilently);
    // Example: Call a fake API endpoint
    authApi.get("/fake-cart-endpoint")
      .then(res => {
        // handle response
        console.log("Cart API response:", res.data);
      })
      .catch(err => {
        // handle error
        console.error("Cart API error:", err);
      });
  }, [getAccessTokenSilently]);
import React, { useState } from "react";

export default function CartPage() {
  const [quantity, setQuantity] = useState(1);
  const [postalCode, setPostalCode] = useState("");
  const [promoCode, setPromoCode] = useState("");

  const pricePerItem = 11.99;
  const subtotal = (pricePerItem * quantity).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">SHOPPING CART (1 Product, {quantity} Item{quantity > 1 ? "s" : ""})</h1>

      {/* Cart Item Section */}
      <div className="flex gap-6 border p-4 rounded-md shadow-sm">
        <img src="/q2/topical-anesthetic.png" alt="Product" className="h-32" />
        <div className="flex-grow">
          <h2 className="font-semibold mb-1">Topical Anesthetic Gel 28gm Jar Mint - D21301-M</h2>
          <p className="text-gray-600">$11.99</p>
          <div className="mt-2">
            <label className="text-sm font-medium">Flavours:</label>
            <p className="text-sm text-gray-700">Mint</p>
          </div>

          <div className="mt-2">
            <label className="text-sm font-medium">Quantity:</label>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border px-2 py-1 w-20 ml-2"
            />
          </div>

          <div className="mt-2">
            <span className="text-sm font-medium">Amount:</span>{" "}
            <span className="font-bold">${subtotal}</span>
          </div>

          <div className="mt-2 text-sm text-gray-600 space-x-4">
            <button className="text-blue-600 underline">Edit</button>
            <button className="text-blue-600 underline">Save for Later</button>
            <button className="text-red-600 underline">Remove</button>
          </div>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"></div> {/* Empty for layout balance */}

        <div className="border p-6 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

          <div className="flex justify-between mb-2 text-sm">
            <span>Subtotal {quantity} item{quantity > 1 ? "s" : ""}</span>
            <span className="font-semibold">${subtotal}</span>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Subtotal Does Not Include Shipping Or Tax
          </p>

          {/* Shipping Estimate */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-1">Estimate Tax & Shipping</h4>
            <p className="text-xs mb-2">Ship available only to Canada</p>
            <input
              type="text"
              placeholder="Postal Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-2"
            />
            <button className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800">
              ESTIMATE
            </button>
          </div>

          {/* Promo Code */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-1">Have a Promo Code?</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="border px-3 py-2 rounded w-full"
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
    </div>
  );
}
