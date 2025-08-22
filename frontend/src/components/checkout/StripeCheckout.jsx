import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import api from "api/api";
import endpoints from "api/endpoints";
import { Button } from "common";

import StripeWrapper from "../stripe/StripeWrapper";

import PaymentForm from "./PaymentForm";
import SavedPaymentMethods from "./SavedPaymentMethods";

import { selectCartSubtotalWithDiscounts } from "@/redux/slices";

export default function StripeCheckout() {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);

  // Calculate subtotal with discounted prices
  const subtotal = useSelector((state) =>
    selectCartSubtotalWithDiscounts(state, cart)
  );

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [customerId] = useState("cus_example123"); // TODO: Get from user data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved data from localStorage
  useEffect(() => {
    const savedPaymentMethodId = localStorage.getItem(
      "selectedPaymentMethodId"
    );
    if (savedPaymentMethodId) {
      setSelectedPaymentMethodId(savedPaymentMethodId);
    }
  }, []);

  const fetchPaymentMethodDetails = useCallback(async () => {
    try {
      const response = await api.get(endpoints.GET_PAYMENT_METHODS(customerId));
      const paymentMethod = response.data.paymentMethods.find(
        (pm) => pm.id === selectedPaymentMethodId
      );
      setSelectedPaymentMethod(paymentMethod);
    } catch (err) {
      setError("Failed to load payment method details");
    }
  }, [customerId, selectedPaymentMethodId]);

  // Fetch payment method details when selected
  useEffect(() => {
    if (selectedPaymentMethodId && !selectedPaymentMethod) {
      fetchPaymentMethodDetails();
    }
  }, [
    selectedPaymentMethodId,
    selectedPaymentMethod,
    fetchPaymentMethodDetails,
  ]);

  const createPaymentIntent = async () => {
    if (!selectedPaymentMethodId || !subtotal) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.post(endpoints.POST_CREATE_PAYMENT(), {
        paymentMethod: selectedPaymentMethodId,
        amount: subtotal, // Amount in dollars
        currency: "cad",
        customerId: customerId,
        description: `Order payment for ${cart.length} item(s)`,
      });

      setPaymentIntent(response.data.paymentIntent);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create payment intent"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentResult) => {
    // Handle successful payment
    localStorage.removeItem("selectedPaymentMethodId");
    navigate("/checkout/success", {
      state: {
        paymentIntent: paymentResult,
        orderAmount: subtotal,
      },
    });
  };

  const handlePaymentError = (error) => {
    setError(error.message || "Payment failed. Please try again.");
  };

  const handleSelectPaymentMethod = (paymentMethodId) => {
    setSelectedPaymentMethodId(paymentMethodId);
    setSelectedPaymentMethod(null);
    setPaymentIntent(null);
    localStorage.setItem("selectedPaymentMethodId", paymentMethodId);
  };

  return (
    <StripeWrapper>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">
            Review your order and complete the payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Payment Method Selection */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Select Payment Method
              </h2>
              <SavedPaymentMethods
                customerId={customerId}
                onSelectPaymentMethod={handleSelectPaymentMethod}
                selectedPaymentMethodId={selectedPaymentMethodId}
              />
            </div>

            {selectedPaymentMethodId && !paymentIntent && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Ready to Pay</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Click "Create Payment" to proceed with your selected payment
                  method.
                </p>
                <Button
                  onClick={createPaymentIntent}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Creating Payment..." : "Create Payment"}
                </Button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Right Column - Payment Form */}
          <div>
            {selectedPaymentMethod && paymentIntent ? (
              <PaymentForm
                paymentMethod={selectedPaymentMethod}
                paymentIntent={paymentIntent}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="text-gray-500">
                  <div className="text-4xl mb-4">💳</div>
                  <h3 className="text-lg font-medium mb-2">
                    Complete Payment Setup
                  </h3>
                  <p className="text-sm">
                    Select a payment method and create a payment intent to
                    continue
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Items ({cart.length})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>$9.99</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${(subtotal + 9.99).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/checkout/payment")}
          >
            ← Back to Payment & Shipping
          </Button>
        </div>
      </div>
    </StripeWrapper>
  );
}
