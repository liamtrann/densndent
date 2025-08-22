import {
  useStripe,
  useElements,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";

import api from "api/api";
import endpoints from "api/endpoints";
import { Button } from "common";

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
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [cvcError, setCvcError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

      // Confirm the payment
      const response = await api.post(endpoints.POST_CONFIRM_PAYMENT(), {
        paymentMethod: paymentMethod.id,
        paymentIntent: paymentIntent.id,
      });

      handleServerResponse(response.data.paymentIntent);
    } catch (err) {
      setCvcError("Payment confirmation failed. Please try again.");
      setIsProcessing(false);
      if (onPaymentError) {
        onPaymentError(err);
      }
    }
  };

  function handleServerResponse(response) {
    if (response.error) {
      setCvcError(response.error.message || "Payment failed");
      setIsProcessing(false);
      if (onPaymentError) {
        onPaymentError(response.error);
      }
    } else if (response.next_action) {
      handleAction(response);
    } else if (response.status === "succeeded") {
      setIsProcessing(false);
      if (onPaymentSuccess) {
        onPaymentSuccess(response);
      }
    } else {
      setIsProcessing(false);
      setCvcError("Payment processing failed. Please try again.");
    }
  }

  function handleAction(response) {
    stripe.handleCardAction(response.client_secret).then(function (result) {
      if (result.error) {
        setCvcError(result.error.message || "Authentication failed");
        setIsProcessing(false);
        if (onPaymentError) {
          onPaymentError(result.error);
        }
      } else {
        // Re-confirm the payment after 3D Secure
        api
          .post(endpoints.POST_CONFIRM_PAYMENT(), {
            paymentIntent: paymentIntent.id,
            paymentMethod: paymentMethod.id,
          })
          .then((resp) => {
            handleServerResponse(resp.data.paymentIntent);
          })
          .catch((err) => {
            setCvcError("Payment confirmation failed after authentication");
            setIsProcessing(false);
            if (onPaymentError) {
              onPaymentError(err);
            }
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
