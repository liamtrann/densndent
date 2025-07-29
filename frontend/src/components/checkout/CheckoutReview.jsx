import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import InputField from "common/ui/InputField";
import Button from "common/ui/Button";
import { Loading } from "common";
import CheckoutSummary from "components/checkout/CheckoutSummary";
import ToastNotification from "common/toast/Toast";
import api from "api/api";
import endpoint from "api/endpoints";
import { clearCart } from "store/slices/cartSlice";

export default function CheckoutReview() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const [paymentMethod, setPaymentMethod] = useState("invoice"); // NEW
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // Loading state

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("checkoutAddresses") || "[]"
    );
    const selected = Number(localStorage.getItem("selectedAddressId"));
    const selectedAddress = stored.find((addr) => addr.id === selected);
    setBillingAddress(selectedAddress);
  }, []);

  const handlePlaceOrder = async () => {
    // Check if user ID is available
    if (!userInfo?.id) {
      ToastNotification.error(
        "User information not available. Please refresh the page and try again."
      );
      return;
    }

    // Check if user is a valid customer
    if (userInfo.searchstage !== "Customer") {
      ToastNotification.error(
        "New customers must contact support to place orders. We only allow orders for existing customers. Please contact our support team."
      );
      return;
    }

    // Check if billing address is available
    if (!billingAddress) {
      ToastNotification.error(
        "Please select a billing address before placing the order."
      );
      return;
    }

    // Check if cart has items
    if (!cartItems || cartItems.length === 0) {
      ToastNotification.error(
        "Your cart is empty. Please add items before placing an order."
      );
      return;
    }

    const orderPayload = {
      entity: {
        id: userInfo.id,
        type: userInfo.searchstage,
      },
      item: {
        items: cartItems.map((item) => ({
          item: {
            id: item.netsuiteId || item.id,
          },
          quantity: item.quantity,
        })),
      },
      toBeEmailed: true,
      shipMethod: {
        id: "20412",
      },
      billingAddress: {
        addr1: billingAddress.address,
        addressee: billingAddress.fullName,
        city: billingAddress.city,
        country: { id: "CA" },
        state: billingAddress.state,
        zip: billingAddress.zip,
      },
      shippingAddress: sameAsShipping
        ? {
            addr1: billingAddress.address,
            addressee: billingAddress.fullName,
            city: billingAddress.city,
            country: { id: "CA" },
            state: billingAddress.state,
            zip: billingAddress.zip,
          }
        : null,
      paymentMethod: paymentMethod, // Optional: Include method
    };

    try {
      setIsPlacingOrder(true);

      const response = await api.post(
        endpoint.POST_SALES_ORDER(),
        orderPayload
      );

      // Show success message
      ToastNotification.success("Order placed successfully!");

      // Clear cart after successful order
      dispatch(clearCart());

      // Clear checkout addresses from localStorage
      localStorage.removeItem("checkoutAddresses");
      localStorage.removeItem("selectedAddressId");

      // Redirect to order history
      navigate("/profile/history");
    } catch (error) {
      console.error("Error placing order:", error);
      ToastNotification.error(
        error?.response?.data?.error ||
          "Failed to place order. Please try again."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Loading Overlay */}
      {isPlacingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
            <Loading text="Processing your order..." />
            <div className="mt-4 space-y-2">
              <p className="text-gray-700 font-medium">
                Please don't close this window
              </p>
              <p className="text-sm text-gray-600">
                We're creating your order and sending confirmation details. This
                may take a few minutes.
              </p>
              <p className="text-xs text-gray-500 mt-3">
                You'll be redirected to your order history once complete.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Billing Address */}
          {billingAddress && (
            <div className="border rounded shadow-sm p-4 bg-white">
              <h3 className="font-semibold mb-2">Billing Address</h3>
              <div className="text-sm space-y-1">
                <div className="font-semibold">{billingAddress.fullName}</div>
                <div>{billingAddress.address}</div>
                <div>
                  {[
                    billingAddress.city,
                    billingAddress.state,
                    billingAddress.zip,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
                <div>{billingAddress.country}</div>
                <div className="text-blue-700">
                  {billingAddress.phone || "Phone not available"}
                </div>
              </div>
            </div>
          )}

          {/* Same as Shipping */}
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

          {/* Payment Method */}
          <div className="border rounded shadow-sm p-4 bg-white space-y-4">
            <h3 className="font-semibold mb-2">Payment Method</h3>

            {/* Tabs */}
            <div className="flex space-x-4 border-b mb-4">
              {/* <button
                className={`py-2 px-4 font-medium ${
                  paymentMethod === "card"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                Credit/Debit Card
              </button> */}
              <button
                className={`py-2 px-4 font-medium ${
                  paymentMethod === "invoice"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setPaymentMethod("invoice")}
              >
                Invoice
              </button>
            </div>

            {/* Credit Card Fields */}
            {/* {paymentMethod === "card" && (
              <>
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
              </>
            )} */}

            {/* Invoice Message */}
            {paymentMethod === "invoice" && (
              <div className="text-sm text-gray-700">
                An invoice will be emailed to the billing address after the
                order is confirmed.
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={() => navigate("/checkout/payment")}
              disabled={isPlacingOrder}
            >
              Back
            </Button>
            <Button onClick={handlePlaceOrder} disabled={isPlacingOrder}>
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="hidden lg:block"></div>
      </div>
    </div>
  );
}
