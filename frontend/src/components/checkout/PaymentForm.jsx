import { useAuth0 } from "@auth0/auth0-react";
import {
  useStripe,
  useElements,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "store/slices/cartSlice";

import api from "api/api";
import endpoints from "api/endpoints";
import { Button } from "common";
import ToastNotification from "common/toast/Toast";

const CVC_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#424770",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
      iconColor: "#fa755a",
    },
  },
};

export default function PaymentForm({
  paymentMethod,
  paymentIntent,
  onPaymentSuccess,
  onPaymentError,
  buildOrderPayload,
  isProcessing,
  setIsProcessing,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();

  const [cvcError, setCvcError] = useState(null);

  // Function to clear cart and localStorage after successful payment
  const clearCheckoutData = () => {
    // Clear cart
    dispatch(clearCart());

    // Clear checkout-related localStorage items
    localStorage.removeItem("selectedPaymentMethodId");
    localStorage.removeItem("paymentMethod");
    localStorage.removeItem("checkoutAddresses");
    localStorage.removeItem("selectedAddressId");
    localStorage.removeItem("pendingPaymentIntent");
  };

  if (!paymentMethod || !paymentIntent) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="text-center text-gray-500">
          Please select a payment method first
        </div>
      </div>
    );
  }

  const { card, billing_details } = paymentMethod;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setCvcError(null);

    try {
      // Create CVC token to validate the CVC
      const { error } = await stripe.createToken(
        "cvc_update",
        elements.getElement(CardCvcElement)
      );

      if (error) {
        setCvcError(error.message);
        setIsProcessing(false);
        return;
      }

      // Get order payload for payment confirmation
      const orderData = buildOrderPayload ? buildOrderPayload() : null;

      // Get authentication token
      const token = await getAccessTokenSilently();

      // Confirm the payment
      const response = await api.post(
        endpoints.POST_CONFIRM_PAYMENT(),
        {
          paymentIntentId: paymentIntent.id,
          paymentMethodId: paymentMethod.id,
          orderData: orderData,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: "never", // <- key bit
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the new queue-based response structure
      handleServerResponse(response.data);
    } catch (err) {
      setCvcError("Payment confirmation failed. Please try again.");
      setIsProcessing(false);
      ToastNotification.error("Payment confirmation failed. Please try again.");

      // Clear potentially invalid payment intent from localStorage
      localStorage.removeItem("pendingPaymentIntent");

      if (onPaymentError) {
        onPaymentError(err);
      }
    }
  };

  function handleServerResponse(response) {
    const paymentIntent = response.paymentIntent || response;

    if (paymentIntent.error) {
      setCvcError(paymentIntent.error.message || "Payment failed");
      setIsProcessing(false);
      ToastNotification.error(
        paymentIntent.error.message || "Payment failed. Please try again."
      );

      // Clear potentially invalid payment intent from localStorage
      localStorage.removeItem("pendingPaymentIntent");

      if (onPaymentError) {
        onPaymentError(paymentIntent.error);
      }
    } else if (paymentIntent.next_action) {
      handleAction(paymentIntent);
    } else if (paymentIntent.status === "succeeded") {
      // Clear checkout data after successful payment
      clearCheckoutData();

      // Show different message based on whether order creation was completed
      const successMessage = response.jobResult
        ? "Payment and order completed successfully! You'll receive a confirmation email shortly."
        : response.jobId
          ? "Payment completed successfully! Your order has been created and you'll receive a confirmation email shortly."
          : "Payment completed successfully! Your order has been placed.";

      ToastNotification.success(successMessage);

      setIsProcessing(false);
      if (onPaymentSuccess) {
        onPaymentSuccess(paymentIntent);
      }
    } else {
      setIsProcessing(false);
      setCvcError("Payment processing failed. Please try again.");
      ToastNotification.error("Payment processing failed. Please try again.");

      // Clear potentially invalid payment intent from localStorage
      localStorage.removeItem("pendingPaymentIntent");
    }
  }
  function handleAction(response) {
    stripe.handleCardAction(response.client_secret).then(function (result) {
      if (result.error) {
        setCvcError(result.error.message || "Authentication failed");
        setIsProcessing(false);
        ToastNotification.error(
          result.error.message || "Authentication failed. Please try again."
        );

        // Clear potentially invalid payment intent from localStorage
        localStorage.removeItem("pendingPaymentIntent");

        if (onPaymentError) {
          onPaymentError(result.error);
        }
      } else {
        // Get order payload for re-confirmation after 3D Secure
        const orderData = buildOrderPayload ? buildOrderPayload() : null;

        // Get authentication token for re-confirmation
        getAccessTokenSilently()
          .then((token) => {
            // Re-confirm the payment after 3D Secure
            api
              .post(
                endpoints.POST_CONFIRM_PAYMENT(),
                {
                  paymentIntentId: paymentIntent.id,
                  paymentMethodId: paymentMethod.id,
                  orderData: orderData,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )
              .then((resp) => {
                handleServerResponse(resp.data);
              })
              .catch((err) => {
                setCvcError("Payment confirmation failed after authentication");
                setIsProcessing(false);
                ToastNotification.error(
                  "Payment confirmation failed after authentication. Please try again."
                );

                // Clear potentially invalid payment intent from localStorage
                localStorage.removeItem("pendingPaymentIntent");

                if (onPaymentError) {
                  onPaymentError(err);
                }
              });
          })
          .catch((tokenErr) => {
            setCvcError("Failed to get authentication token");
            setIsProcessing(false);
            ToastNotification.error("Authentication failed. Please try again.");

            // Clear potentially invalid payment intent from localStorage
            localStorage.removeItem("pendingPaymentIntent");
          });
      }
    });
  }

  const formatCardBrand = (brand) => {
    const brandMap = {
      visa: "Visa",
      mastercard: "Mastercard",
      amex: "American Express",
      discover: "Discover",
      diners: "Diners Club",
      jcb: "JCB",
      unionpay: "UnionPay",
    };
    return brandMap[brand] || brand;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>

      {/* Selected Payment Method Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Selected Payment Method</h4>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-semibold">
            {card.brand.toUpperCase()}
          </div>
          <div>
            <div className="font-medium">
              {formatCardBrand(card.brand)} •••• {card.last4}
            </div>
            <div className="text-sm text-gray-500">
              Expires {card.exp_month.toString().padStart(2, "0")}/
              {card.exp_year}
            </div>
            {billing_details?.name && (
              <div className="text-sm text-gray-500">
                {billing_details.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Amount */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Amount:</span>
          <span className="text-xl font-bold text-blue-600">
            ${(paymentIntent.amount / 100).toFixed(2)}{" "}
            {paymentIntent.currency.toUpperCase()}
          </span>
        </div>
      </div>

      {/* CVC Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter CVC/CVV for verification *
          </label>
          <div className="border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
            <CardCvcElement
              options={CVC_ELEMENT_OPTIONS}
              onChange={() => {
                setCvcError(null);
              }}
            />
          </div>
          {cvcError && <p className="text-red-600 text-sm mt-1">{cvcError}</p>}
        </div>

        <div className="text-xs text-gray-500 mb-4">
          <p>
            • Your CVC is the 3-digit security code on the back of your card
          </p>
          <p>• This helps verify that you have the physical card</p>
        </div>

        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full py-3 text-lg"
        >
          {isProcessing
            ? "Processing Payment..."
            : `Pay $${(paymentIntent.amount / 100).toFixed(2)}`}
        </Button>
      </form>

      {/* Security Notice */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p>Powered by Stripe</p>
      </div>
    </div>
  );
}
