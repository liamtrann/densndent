import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

import api from "api/api";
import endpoints from "api/endpoints";
import { Button } from "common";

const CARD_ELEMENT_OPTIONS = {
  hidePostalCode: true, // Hide the postal code field in CardElement since we handle it separately
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

export default function AddPaymentMethod({
  customerId,
  billingAddress,
  onPaymentMethodAdded,
  onCancel,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state for cardholder name only
  const [cardInfo, setCardInfo] = useState({
    name: "",
  });

  const handleInputChange = (field, value) => {
    setCardInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!billingAddress) {
      setError("Please select a billing address first");
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    // Prepare billing details using the selected address
    const billingDetails = {
      name: cardInfo.name,
      address: {
        country: billingAddress.country || "CA",
        state: billingAddress.state || billingAddress.province,
        city: billingAddress.city,
        line1: billingAddress.line1 || billingAddress.address,
        postal_code: billingAddress.zip || billingAddress.postalCode,
      },
    };

    console.log(customerId, billingDetails);

    try {
      // Create payment method on the frontend
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: billingDetails,
        });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // Send payment method ID to backend to attach to customer
      const response = await api.post(
        endpoints.POST_ATTACH_PAYMENT_METHOD(customerId),
        {
          paymentMethod: paymentMethod,
        }
      );

      if (response.data) {
        onPaymentMethodAdded(response.data.paymentMethod);
        // Reset form
        setCardInfo({
          name: "",
        });
        cardElement.clear();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while adding payment method"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Add Payment Method</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name *
          </label>
          <input
            type="text"
            value={cardInfo.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
            required
          />
        </div>

        {/* Card Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Information *
          </label>
          <div className="border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>

        {/* Display Selected Billing Address */}
        {billingAddress ? (
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Billing Address (from checkout)
            </h4>
            <div className="text-sm text-gray-600">
              <div>{billingAddress.line1 || billingAddress.address}</div>
              <div>
                {billingAddress.city},{" "}
                {billingAddress.state || billingAddress.province}{" "}
                {billingAddress.postal_code || billingAddress.postalCode}
              </div>
              <div>{billingAddress.country || "Canada"}</div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <p className="text-sm text-yellow-800">
              Please select a billing address in the checkout flow
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!stripe || loading}
            className="min-w-[120px]"
          >
            {loading ? "Adding..." : "Add Payment Method"}
          </Button>
        </div>
      </form>
    </div>
  );
}
