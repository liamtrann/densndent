import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import InputField from "../common/InputField";
import Button from "../common/Button";
import Dropdown from "../common/Dropdown";
import Paragraph from "../common/Paragraph";
import { ProductImage } from "../common";

export default function CheckoutPage() {
  const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const cart = useSelector((state) => state.cart.items);

  const [promoCode, setPromoCode] = useState("");
  const [addressFilled, setAddressFilled] = useState(false); // Placeholder for validation

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    } else if (isAuthenticated) {
      (async () => {
        try {
          await getAccessTokenSilently({
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          });
        } catch (err) {
          console.error("Error getting access token:", err);
        }
      })();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 text-center">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <Paragraph>Checking authentication...</Paragraph>
      </div>
    );
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.unitprice || item.price || 0) * item.quantity,
    0
  ).toFixed(2);

  const renderCartSummary = () => (
    <div className="border p-6 rounded shadow-md bg-white">
      <h3 className="text-lg font-semibold mb-4">Summary</h3>
      <div className="mb-2 flex justify-between text-sm">
        <span>SUBTOTAL {cart.length} ITEM{cart.length !== 1 ? "S" : ""}</span>
        <span className="font-semibold">${subtotal}</span>
      </div>
      <Paragraph className="text-xs text-gray-500 mb-2">
        Subtotal Does Not Include Shipping Or Tax
      </Paragraph>
      <div className="mb-2 flex justify-between text-sm">
        <span>Shipping</span>
        <span>$0.00</span>
      </div>
      <div className="mb-4 flex justify-between font-semibold">
        <span>TOTAL</span>
        <span>${subtotal}</span>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium mb-1">Have a Promo Code?</h4>
        <div className="flex gap-2">
          <InputField
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter code"
          />
          <Button onClick={() => {}}>Apply</Button>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Items to Ship ({cart.length})</h4>
        <div className="space-y-3 text-sm">
          {cart.map((item, idx) => (
            <div key={item.id + "-" + idx} className="p-3 border rounded space-y-1">
              <div className="font-semibold">{item.itemid || item.displayname}</div>
              <div>Unit price: ${item.unitprice || item.price}</div>
              <div>Quantity: {item.quantity}</div>
              <div className="font-bold">Amount: ${(item.unitprice || item.price) * item.quantity}</div>
            </div>
          ))}
        </div>
        <Button className="text-blue-600 text-xs underline mt-2" variant="link">
          Edit Cart
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <Paragraph className="mb-6 text-sm text-gray-500">
        1. Shipping Address / <strong>2. Payment</strong> / 3. Review
      </Paragraph>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Choose Shipping Address</h2>

          <div className="bg-white p-6 rounded shadow-md space-y-4">
            <InputField label="Full Name" placeholder="Huzaifa Khan" />
            <InputField label="Address" placeholder="1234 Main Street" />
            <InputField placeholder="(optional)" />
            <InputField label="City *" />

            <Dropdown label="State *" options={["NY", "CA", "TX"]} />

            <InputField label="Zip Code *" placeholder="94117" />
            <InputField label="Phone Number *" placeholder="555-123-1234" />
            <InputField
              type="checkbox"
              checked={false}
              onChange={() => {}}
              label="This is a Residential Address"
            />
          </div>

          {/* Delivery Method */}
          <div className="bg-gray-50 border mt-6 p-6 rounded shadow">
            <h3 className="font-semibold text-lg mb-3">Delivery Method</h3>
            {!addressFilled && (
              <Paragraph className="text-yellow-800 bg-yellow-100 border border-yellow-300 p-3 rounded text-sm">
                <strong>Warning:</strong> Please enter a valid shipping address first
              </Paragraph>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <Button
              className="px-6 py-3"
              disabled={!addressFilled}
              onClick={() => {}}
            >
              Continue
            </Button>
          </div>
        </div>

        {/* Right: Summary */}
        {renderCartSummary()}
      </div>
    </div>
  );
}
