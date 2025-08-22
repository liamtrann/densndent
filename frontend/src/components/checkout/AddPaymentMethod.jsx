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
  onPaymentMethodAdded,
  onCancel,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state for billing details
  const [cardInfo, setCardInfo] = useState({
    name: "",
    address: {
      line1: "",
      city: "",
      state: "",
      country: "CA",
      postal_code: "",
    },
  });

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setCardInfo((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setCardInfo((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Format Canadian postal code as user types
  const formatCanadianPostalCode = (value) => {
    // Remove all non-alphanumeric characters
    const clean = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

    // Format as "A1A 1A1"
    if (clean.length <= 3) {
      return clean;
    } else {
      return clean.slice(0, 3) + " " + clean.slice(3, 6);
    }
  };

  // Validate Canadian postal code
  const validateCanadianPostalCode = (postalCode) => {
    const canadianPostalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    return canadianPostalRegex.test(postalCode);
  };

  const handlePostalCodeChange = (value) => {
    if (cardInfo.address.country === "CA") {
      // Format Canadian postal codes
      const formatted = formatCanadianPostalCode(value);
      handleInputChange("address.postal_code", formatted);
    } else {
      // For other countries, just use the value as-is
      handleInputChange("address.postal_code", value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Validate Canadian postal code before submission
    if (cardInfo.address.country === "CA" && cardInfo.address.postal_code) {
      if (!validateCanadianPostalCode(cardInfo.address.postal_code)) {
        setError("Please enter a valid Canadian postal code (e.g., K1A 0A9)");
        return;
      }
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    // Prepare billing details
    const billingDetails = {
      name: cardInfo.name,
      address: {
        country: cardInfo.address.country,
        state: cardInfo.address.state,
        city: cardInfo.address.city,
        line1: cardInfo.address.line1,
        postal_code:
          cardInfo.address.country === "CA"
            ? cardInfo.address.postal_code.replace(/\s/g, "") // Remove spaces for Canadian postal codes
            : cardInfo.address.postal_code,
      },
    };

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
          address: {
            line1: "",
            city: "",
            state: "",
            country: "CA",
            postal_code: "",
          },
        });
        cardElement.clear();
      }
    } catch (err) {
      console.log(err);
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

        {/* Billing Address */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Billing Address</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1 *
            </label>
            <input
              type="text"
              value={cardInfo.address.line1}
              onChange={(e) =>
                handleInputChange("address.line1", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 Main Street"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                value={cardInfo.address.city}
                onChange={(e) =>
                  handleInputChange("address.city", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Toronto"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Province *
              </label>
              <input
                type="text"
                value={cardInfo.address.state}
                onChange={(e) =>
                  handleInputChange("address.state", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ON"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                value={cardInfo.address.country}
                onChange={(e) =>
                  handleInputChange("address.country", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="CA">Canada</option>
                <option value="US">United States</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                value={cardInfo.address.postal_code}
                onChange={(e) => handlePostalCodeChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  cardInfo.address.country === "CA" &&
                  cardInfo.address.postal_code &&
                  !validateCanadianPostalCode(cardInfo.address.postal_code)
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder={
                  cardInfo.address.country === "CA" ? "K1A 0A9" : "Postal Code"
                }
                maxLength={cardInfo.address.country === "CA" ? 7 : undefined}
                required
              />
              {cardInfo.address.country === "CA" && (
                <div className="mt-1">
                  <p className="text-xs text-gray-500">
                    Format: A1A 1A1 (automatically formatted)
                  </p>
                  {cardInfo.address.postal_code &&
                    !validateCanadianPostalCode(
                      cardInfo.address.postal_code
                    ) && (
                      <p className="text-xs text-red-600">
                        Please enter a valid Canadian postal code
                      </p>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>

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
