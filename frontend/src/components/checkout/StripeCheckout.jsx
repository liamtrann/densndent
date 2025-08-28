import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "api/api";
import endpoints from "api/endpoints";
import { Button } from "common";
import { formatPrice } from "config/config";

import StripeWrapper from "../stripe/StripeWrapper";

import PaymentForm from "./PaymentForm";
import SavedPaymentMethods from "./SavedPaymentMethods";

export default function StripeCheckout({
  stripeCustomerId,
  orderTotal,
  createPaymentIntent,
  handlePaymentSuccess,
  handlePaymentError,
  buildOrderPayload,
  isProcessing,
  setIsProcessing,
}) {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

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
    const savedPaymentIntent = localStorage.getItem("pendingPaymentIntent");

    if (savedPaymentMethodId && stripeCustomerId) {
      setSelectedPaymentMethodId(savedPaymentMethodId);

      // Restore saved payment intent if it exists and is still valid
      if (savedPaymentIntent) {
        try {
          const parsedPaymentIntent = JSON.parse(savedPaymentIntent);

          // Basic validation - check if payment intent is in a valid state and matches current order total
          if (
            parsedPaymentIntent.id &&
            (parsedPaymentIntent.status === "requires_confirmation" ||
              parsedPaymentIntent.status === "requires_action") &&
            parsedPaymentIntent.amount === formatPrice(orderTotal) * 100
          ) {
            // Stripe stores amount in cents
            setPaymentIntent(parsedPaymentIntent);
          } else {
            // Payment intent is not valid or doesn't match current order, remove it
            localStorage.removeItem("pendingPaymentIntent");
          }
        } catch (error) {
          // Invalid saved payment intent, remove it
          localStorage.removeItem("pendingPaymentIntent");
        }
      }

      // Fetch the payment method details for the saved ID
      const fetchSavedPaymentMethod = async () => {
        try {
          const token = await getAccessTokenSilently();
          const response = await api.get(
            endpoints.GET_PAYMENT_METHODS(stripeCustomerId),
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
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
            localStorage.removeItem("pendingPaymentIntent");
            setSelectedPaymentMethodId(null);
            setPaymentIntent(null);
          }
        } catch (error) {
          // Clear invalid saved data on error
          localStorage.removeItem("selectedPaymentMethodId");
          localStorage.removeItem("pendingPaymentIntent");
          setSelectedPaymentMethodId(null);
          setPaymentIntent(null);
        }
      };

      fetchSavedPaymentMethod();
    }
  }, [stripeCustomerId, getAccessTokenSilently, orderTotal]);

  // Clear payment intent if order total changes significantly or becomes 0
  useEffect(() => {
    if (paymentIntent && orderTotal !== undefined) {
      const currentIntentAmount = paymentIntent.amount / 100; // Convert from cents
      const currentOrderTotal = formatPrice(orderTotal);

      // If order total changed or is 0, clear the payment intent
      if (
        currentOrderTotal === 0 ||
        Math.abs(currentIntentAmount - currentOrderTotal) > 0.01
      ) {
        setPaymentIntent(null);
        localStorage.removeItem("pendingPaymentIntent");
      }
    }
  }, [orderTotal, paymentIntent]);

  const handleCreatePaymentIntent = async () => {
    if (!selectedPaymentMethodId || !orderTotal) return;

    // Check if we already have a valid payment intent for the same order total
    if (
      paymentIntent &&
      (paymentIntent.status === "requires_confirmation" ||
        paymentIntent.status === "requires_action") &&
      paymentIntent.amount === formatPrice(orderTotal) * 100
    ) {
      // Stripe stores amount in cents
      // Already have a pending payment intent for the same amount, no need to create a new one
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newPaymentIntent = await createPaymentIntent(
        selectedPaymentMethodId
      );
      setPaymentIntent(newPaymentIntent);

      // Save the payment intent to localStorage to persist across page refreshes
      localStorage.setItem(
        "pendingPaymentIntent",
        JSON.stringify(newPaymentIntent)
      );
    } catch (err) {
      setError(err.message);
      // Clear any invalid payment intent from localStorage
      localStorage.removeItem("pendingPaymentIntent");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPaymentMethod = (paymentMethodId, paymentMethod = null) => {
    setSelectedPaymentMethodId(paymentMethodId);
    setSelectedPaymentMethod(paymentMethod);

    // Clear payment intent when payment method changes
    setPaymentIntent(null);
    localStorage.removeItem("pendingPaymentIntent");
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

        <div className="space-y-8">
          {/* Payment Method Selection */}
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

          {/* Payment Form */}
          <div>
            {paymentIntent && selectedPaymentMethod ? (
              <PaymentForm
                paymentMethod={selectedPaymentMethod}
                paymentIntent={paymentIntent}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                buildOrderPayload={buildOrderPayload}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
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
                        : paymentIntent &&
                            (paymentIntent.status === "requires_confirmation" ||
                              paymentIntent.status === "requires_action")
                          ? "Payment is ready! You can now complete the payment below."
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
            onClick={handleCreatePaymentIntent}
            disabled={
              !selectedPaymentMethodId ||
              (paymentIntent &&
                (paymentIntent.status === "requires_confirmation" ||
                  paymentIntent.status === "requires_action")) ||
              loading
            }
          >
            {loading
              ? "Creating Payment..."
              : paymentIntent &&
                  (paymentIntent.status === "requires_confirmation" ||
                    paymentIntent.status === "requires_action")
                ? "Payment Ready"
                : "Create Payment"}
          </Button>
        </div>
      </div>
    </StripeWrapper>
  );
}
