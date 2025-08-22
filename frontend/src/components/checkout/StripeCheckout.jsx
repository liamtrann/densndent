import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import api from "api/api";
import endpoints from "api/endpoints";
import { Button } from "common";
import { formatPrice } from "config/config";

import StripeWrapper from "../stripe/StripeWrapper";

import PaymentForm from "./PaymentForm";
import SavedPaymentMethods from "./SavedPaymentMethods";

export default function StripeCheckout({ stripeCustomerId, orderTotal }) {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);

  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved data from localStorage and fetch payment method details if needed
  useEffect(() => {
    const savedPaymentMethodId = localStorage.getItem(
      "selectedPaymentMethodId"
    );

    if (savedPaymentMethodId && stripeCustomerId) {
      setSelectedPaymentMethodId(savedPaymentMethodId);

      // Fetch the payment method details for the saved ID
      const fetchSavedPaymentMethod = async () => {
        try {
          const response = await api.get(
            endpoints.GET_PAYMENT_METHODS(stripeCustomerId)
          );
          const paymentMethods = response.data.paymentMethods || [];
          const paymentMethod = paymentMethods.find(
            (pm) => pm.id === savedPaymentMethodId
          );
          if (paymentMethod) {
            setSelectedPaymentMethod(paymentMethod);
          } else {
            // Payment method not found, clear saved data
            localStorage.removeItem("selectedPaymentMethodId");
            setSelectedPaymentMethodId(null);
          }
        } catch (error) {
          // Clear invalid saved data on error
          localStorage.removeItem("selectedPaymentMethodId");
          setSelectedPaymentMethodId(null);
        }
      };

      fetchSavedPaymentMethod();
    }
  }, [stripeCustomerId]);

  const createPaymentIntent = async () => {
    if (!selectedPaymentMethodId || !orderTotal) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.post(endpoints.POST_CREATE_PAYMENT(), {
        paymentMethod: selectedPaymentMethodId,
        amount: formatPrice(orderTotal),
        currency: "cad",
        customerId: stripeCustomerId,
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
    localStorage.removeItem("paymentMethod");
    // Clear cart or any other cleanup logic here if needed

    navigate("/purchase-history", {
      state: {
        paymentIntent: paymentResult,
        orderAmount: orderTotal,
        paymentSuccessMessage: "Payment completed successfully!",
      },
    });
  };

  const handlePaymentError = (error) => {
    setError(error.message || "Payment failed. Please try again.");
  };

  const handleSelectPaymentMethod = (paymentMethodId, paymentMethod = null) => {
    setSelectedPaymentMethodId(paymentMethodId);
    setSelectedPaymentMethod(paymentMethod);
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
                customerId={stripeCustomerId}
                onSelectPaymentMethod={handleSelectPaymentMethod}
                selectedPaymentMethodId={selectedPaymentMethodId}
                showTitle={false}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Right Column - Payment Form */}
          <div>
            {paymentIntent && selectedPaymentMethod ? (
              <PaymentForm
                paymentMethod={selectedPaymentMethod}
                paymentIntent={paymentIntent}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            ) : (
              <div className="space-y-6">
                {/* Payment Setup Placeholder */}
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <div className="text-gray-500">
                    <div className="text-4xl mb-4">💳</div>
                    <h3 className="text-lg font-medium mb-2">
                      Complete Payment Setup
                    </h3>
                    <p className="text-sm">
                      {!selectedPaymentMethodId
                        ? "Select a payment method to continue"
                        : "Click 'Create Payment' to proceed with the selected payment method"}
                    </p>
                  </div>
                </div>
              </div>
            )}
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

          <Button
            onClick={createPaymentIntent}
            disabled={!selectedPaymentMethodId || paymentIntent || loading}
          >
            {loading ? "Creating Payment..." : "Create Payment"}
          </Button>
        </div>
      </div>
    </StripeWrapper>
  );
}
