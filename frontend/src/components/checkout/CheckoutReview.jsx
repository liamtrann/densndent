import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import InputField from "common/ui/InputField";
import Button from "common/ui/Button";
import CheckoutSummary from "components/checkout/CheckoutSummary";

export default function CheckoutReview() {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.info);
  const cartItems = useSelector((state) => state.cart.items || []);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [cardNumber, setCardNumber] = useState("1234567812341234");
  const [nameOnCard, setNameOnCard] = useState(() => {
  if (userInfo && userInfo.firstname && userInfo.lastname) {
    return `${userInfo.firstname} ${userInfo.lastname}`;
  }
  return "";
});

  const [expMonth, setExpMonth] = useState("07");
  const [expYear, setExpYear] = useState("2025");
  const [securityCode, setSecurityCode] = useState("");
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("checkoutAddresses") || "[]");
    const selected = Number(localStorage.getItem("selectedAddressId"));
    const selectedAddress = stored.find((addr) => addr.id === selected);
    setBillingAddress(selectedAddress);
  }, []);

  const handlePlaceOrder = () => {
    const orderPayload = {
      entity: {
        id: userInfo?.netsuiteCustomerId || "615449",
        type: "customer"
      },
      item: {
        items: cartItems.map((item) => ({
          item: {
            id: item.netsuiteId || item.id
          },
          quantity: item.quantity
        }))
      },
      toBeEmailed: true,
      shipMethod: {
        id: "20412"
      },
      billingAddress: billingAddress && {
        addr1: billingAddress.address,
        addressee: billingAddress.fullName,
        city: billingAddress.city,
        country: { id: "CA" },
        state: billingAddress.state,
        zip: billingAddress.zip
      },
      shippingAddress: sameAsShipping
        ? billingAddress && {
          addr1: billingAddress.address,
          addressee: billingAddress.fullName,
          city: billingAddress.city,
          country: { id: "CA" },
          state: billingAddress.state,
          zip: billingAddress.zip
        }
        : null // replace if you handle custom shipping address
    };

    console.log("create an order");
    console.log(JSON.stringify(orderPayload, null, 2));

    // Optionally send to API here:
    // api.post('/order/create', orderPayload).then(...)
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {billingAddress && (
            <div className="border rounded shadow-sm p-4 bg-white">
              <h3 className="font-semibold mb-2">Billing Address</h3>
              <div className="text-sm space-y-1">
                <div className="font-semibold">{billingAddress.fullName}</div>
                <div>{billingAddress.address}</div>
                <div>{[billingAddress.city, billingAddress.state, billingAddress.zip].filter(Boolean).join(", ")}</div>
                <div>{billingAddress.country}</div>
                <div className="text-blue-700">{billingAddress.phone || "Phone not available"}</div>
              </div>
            </div>
          )}

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

          <div className="border rounded shadow-sm p-4 bg-white space-y-4">
            <h3 className="font-semibold mb-2">Payment Method</h3>
            <InputField
              label="Credit Card Number"
              type={showCardNumber ? "text" : "password"}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="•••• •••• •••• 1234"
            />
            <Button variant="secondary" onClick={() => setShowCardNumber(!showCardNumber)}>
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

          <div className="flex justify-between">
            <Button variant="secondary" onClick={() => navigate("/checkout/payment")}>
              Back
            </Button>
            <Button onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </div>
        </div>

        {/* Summary Panel */}
        <div className="hidden lg:block">

        </div>
      </div>
    </div>
  );
}
