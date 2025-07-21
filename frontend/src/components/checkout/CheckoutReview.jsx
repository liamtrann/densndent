import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import InputField from "common/ui/InputField";
import Button from "common/ui/Button";
import CheckoutSummary from "components/checkout/CheckoutSummary";

export default function CheckoutReview() {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.info);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [cardNumber, setCardNumber] = useState("1234567812341234");
  const [nameOnCard, setNameOnCard] = useState(userInfo.firstname + ' ' + userInfo.lastname);
  const [expMonth, setExpMonth] = useState("07");
  const [expYear, setExpYear] = useState("2025");
  const [securityCode, setSecurityCode] = useState("");
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const billingAddress = {
    fullName: `${userInfo.firstname} ${userInfo.lastname}`,
    address: userInfo.shipping_address_name?.split("\n")[0] || "Billing Address",
    city: userInfo.shipping_city,
    state: userInfo.shipping_state,
    zip: userInfo.shipping_zip,
    country: userInfo.shipping_country === "CA" ? "Canada" : userInfo.shipping_country,
    phone: userInfo.phone || "Phone not available",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <div className="mb-6 text-sm text-gray-600">
        <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate("/checkout/shipping")}>1. Shipping Address</span>
        <span> / </span>
        <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate("/checkout/payment")}>2. Payment</span>
        <span> / </span>
        <span className="text-blue-600">3. Review</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">

          {/* Billing Address */}
          <div className="border rounded shadow-sm p-4 bg-white">
            <h3 className="font-semibold mb-2">Billing Address</h3>
            <div className="text-sm space-y-1">
              <div className="font-semibold">{billingAddress.fullName}</div>
              <div>{billingAddress.address}</div>
              <div>{[billingAddress.city, billingAddress.state, billingAddress.zip].filter(Boolean).join(", ")}</div>
              <div>{billingAddress.country}</div>
              <div className="text-blue-700">{billingAddress.phone}</div>
            </div>
          </div>

          {/* Same as shipping checkbox */}
          <div className="text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={() => setSameAsShipping(!sameAsShipping)}
                className="mr-2"
              />
              Shipping address same as billing address
            </label>
          </div>

          {/* Credit Card Form */}
          <div className="border rounded shadow-sm p-4 bg-white space-y-4">
            <h3 className="font-semibold mb-2">Payment Method</h3>
            <InputField
              label="Credit Card Number"
              type={showCardNumber ? "text" : "password"}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="•••• •••• •••• 1234"
            />
            <Button
              variant="secondary"
              onClick={() => setShowCardNumber(!showCardNumber)}
            >
              {showCardNumber ? "Hide" : "Show"}
            </Button>
            <InputField
              label="Name on Card"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InputField
                label="Expiration Month"
                value={expMonth}
                onChange={(e) => setExpMonth(e.target.value)}
                placeholder="MM"
              />
              <InputField
                label="Expiration Year"
                value={expYear}
                onChange={(e) => setExpYear(e.target.value)}
                placeholder="YYYY"
              />
              <InputField
                label="Security Code"
                type="password"
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value)}
                placeholder="CVV"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button variant="secondary" onClick={() => navigate("/checkout/payment")}>Back</Button>
            <Button onClick={() => alert("Order Placed!")}>Place Order</Button>
          </div>
        </div>

   
      </div>
    </div>
  );
}
