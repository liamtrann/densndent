import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import InputField from "../common/InputField";
import Dropdown from "../common/Dropdown";

export default function CheckoutPage() {
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    getAccessTokenSilently,
    user,
  } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
      return;
    }
    if (!isLoading && isAuthenticated) {
      (async () => {
        try {
          const token = await getAccessTokenSilently({
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          });
          console.log("Access Token:", token);
        } catch (err) {
          console.error("Error getting access token:", err);
        }
      })();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>
        <div className="bg-white p-6 rounded shadow">
          <p className="text-lg text-gray-700 mb-4">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <p className="text-sm text-gray-600 mb-8">
        <span className="text-sm text-gray-500">1. Shipping Address / </span>
        <span className="font-bold">2. Payment</span>
        <span className="text-sm text-gray-500"> / 3. Review</span>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Shipping Form */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Choose Shipping Address</h2>

          <div className="space-y-5">
            <InputField label="Full Name" value={user?.name || ""} />
            <InputField label="Address" placeholder="Example: 1234 Main Street" />
            <InputField placeholder="(optional)" />
            <InputField label="City" />
            <Dropdown label="State" options={["Alabama", "California", "New York", "Texas"]} />
            <InputField label="Zip Code" placeholder="Example: 94117" />
            <InputField label="Phone Number" placeholder="Example: 555-123-1234" />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="residential" className="mt-1" />
              <label htmlFor="residential" className="text-sm">
                This is a Residential Address
              </label>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-4 rounded border">
            <h3 className="text-lg font-semibold mb-2">Delivery Method</h3>
            <p className="text-sm text-yellow-600 bg-yellow-100 p-2 rounded">
              Warning: Please enter a valid shipping address first
            </p>
          </div>

          <div className="mt-6">
            <button className="bg-[#be3b10] text-white px-8 py-3 rounded hover:bg-[#a4310d]">
              Continue
            </button>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="border p-6 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-center">Summary</h3>
          <div className="text-sm mb-2">
            <strong>SUBTOTAL</strong> 1 ITEM
          </div>
          <div className="text-right font-semibold mb-2">$51.99</div>
          <p className="text-xs text-gray-500 mb-4">
            Subtotal Does Not Include Shipping Or Tax
          </p>
          <div className="mb-2 text-sm">
            <strong>Shipping</strong>
            <div className="text-right">$0.00</div>
          </div>
          <div className="flex justify-between mt-2 font-semibold border-t pt-2">
            <span>TOTAL</span>
            <span>$51.99</span>
          </div>

          {/* Promo */}
          <div className="mt-6">
            <label className="block mb-1 text-sm font-medium">Have a Promo Code?</label>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Enter code"
                className="border px-3 py-2 w-full rounded-l focus:outline-none focus:ring-2 focus:ring-smiles-orange transition"
              />
              <button className="bg-gray-700 text-white px-4 py-2 rounded-r hover:bg-gray-800">
                Apply
              </button>
            </div>
          </div>

          {/* Items to ship */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-2">Items to Ship (1)</h4>
            <div className="border p-3 rounded">
              <p className="text-sm font-semibold">
                Dentsply: XCP Bite Blocks Endo Green 3/Pk - 540935
              </p>
              <p className="text-sm text-gray-600 mt-1">Unit price: $51.99</p>
              <p className="text-sm text-gray-600">Quantity: 1</p>
              <p className="text-sm font-bold">Amount: $51.99</p>
            </div>
            <button className="mt-3 text-blue-600 text-sm underline">Edit Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
