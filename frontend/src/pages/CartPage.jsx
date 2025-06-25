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

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      {/* TODO: Pull real data here */}
      <div className="flex gap-6">
        <img src="/q2/topical-anesthetic.png" alt="Product" className="h-32" />
        <div>
          <h2 className="font-semibold">Topical Anesthetic Gel 28gm Jar - Mint</h2>
          <p>Quantity: 1</p>
          <p>$11.99</p>
        </div>
      </div>
      <div className="mt-10 border-t pt-4 text-right">
        <p className="text-lg font-semibold">Subtotal: $11.99</p>
        <button className="mt-4 bg-purple-800 text-white px-6 py-3 rounded">Proceed to Checkout</button>
      </div>
    </div>
  );
}
