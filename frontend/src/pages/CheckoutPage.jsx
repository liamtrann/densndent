// src/pages/CheckoutPage.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InputField from "../common/InputField";
import Button from "../common/Button";
import Dropdown from "../common/Dropdown";
import Paragraph from "../common/Paragraph";
import CheckoutSummary from "../components/CheckoutSummary";

export default function CheckoutPage() {
  const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const cart = useSelector((state) => state.cart.items);
  const location = useLocation();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [addressFilled, setAddressFilled] = useState(false);

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

  const renderStep = () => {
    const step = location.pathname.split("/")[2] || "shipping";

    switch (step) {
      case "shipping":
        return (
          <div>
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
            <div className="flex justify-end mt-6">
              <Button
                className="px-6 py-3"
                disabled={!addressFilled}
                onClick={() => navigate("/checkout/payment")}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        );
      case "payment":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <Paragraph>Payment form placeholder</Paragraph>
            <div className="flex justify-end mt-6">
              <Button className="px-6 py-3" onClick={() => navigate("/checkout/review")}>
                Continue to Review
              </Button>
            </div>
          </div>
        );
      case "review":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Review</h2>
            <Paragraph>Review summary placeholder</Paragraph>
            <div className="flex justify-end mt-6">
              <Button className="px-6 py-3">Place Order</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <div className="mb-6 text-sm text-gray-600">
        <Link to="/checkout/shipping" className="text-blue-600 hover:underline">1. Shipping Address</Link>
        <span> / </span>
        <Link to="/checkout/payment" className="text-blue-600 hover:underline">2. Payment</Link>
        <span> / </span>
        <Link to="/checkout/review" className="text-blue-600 hover:underline">3. Review</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Steps */}
        <div className="lg:col-span-2">{renderStep()}</div>

        {/* Right: Summary */}
        <CheckoutSummary promoCode={promoCode} setPromoCode={setPromoCode} />
      </div>
    </div>
  );
}
