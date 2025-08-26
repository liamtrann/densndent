import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";

import api from "api/api";
import endpoints from "api/endpoints";
import { Button, InputField, Dropdown } from "common";

const ELEMENT_OPTIONS = {
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

  // Form state for cardholder name and billing address
  const [cardInfo, setCardInfo] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "CA",
  });

  const handleInputChange = (field, value) => {
    setCardInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {

    console.log("test")
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (
      !cardInfo.name ||
      !cardInfo.address ||
      !cardInfo.city ||
      !cardInfo.state ||
      !cardInfo.postalCode
    ) {
      setError("Please fill in all required billing address fields");
      return;
    }

    setLoading(true);
    setError(null);

    const cardNumberElement = elements.getElement(CardNumberElement);

    // Prepare billing details using the form data
    const billingDetails = {
      name: cardInfo.name,
      address: {
        country: cardInfo.country,
        state: cardInfo.state,
        city: cardInfo.city,
        line1: cardInfo.address,
        postal_code: cardInfo.postalCode,
      },
    };

    try {
      // Create payment method on the frontend
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
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
        cardNumberElement.clear();
        elements.getElement(CardExpiryElement).clear();
        elements.getElement(CardCvcElement).clear();
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
        <InputField
          label="Cardholder Name *"
          name="name"
          value={cardInfo.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="John Doe"
          required
        />

        {/* Card Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information *
          </label>

          {/* Card Number */}
          <div className="mb-3">
            <label className="block mb-1 font-medium text-sm">
              Card Number *
            </label>
            <div className="border rounded px-3 py-2 w-full focus-within:outline-none focus-within:ring-2 focus-within:ring-smiles-orange transition">
              <CardNumberElement options={ELEMENT_OPTIONS} />
            </div>
          </div>

          {/* Expiry and CVC Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Expiry Date */}
            <div>
              <label className="block mb-1 font-medium text-sm">
                Expiry Date *
              </label>
              <div className="border rounded px-3 py-2 w-full focus-within:outline-none focus-within:ring-2 focus-within:ring-smiles-orange transition">
                <CardExpiryElement options={ELEMENT_OPTIONS} />
              </div>
            </div>

            {/* CVC */}
            <div>
              <label className="block mb-1 font-medium text-sm">CVC *</label>
              <div className="border rounded px-3 py-2 w-full focus-within:outline-none focus-within:ring-2 focus-within:ring-smiles-orange transition">
                <CardCvcElement options={ELEMENT_OPTIONS} />
              </div>
            </div>
          </div>
        </div>

        {/* Billing Address Form */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Billing Address *
          </label>

          <div className="grid grid-cols-6 gap-3">
            {/* Street Address */}
            <div className="col-span-6">
              <InputField
                label="Street Address *"
                name="address"
                value={cardInfo.address}
                onChange={(e) =>
                  setCardInfo({ ...cardInfo, address: e.target.value })
                }
                placeholder="Street address"
                required
              />
            </div>

            {/* City */}
            <div className="col-span-3">
              <InputField
                label="City *"
                name="city"
                value={cardInfo.city}
                onChange={(e) =>
                  setCardInfo({ ...cardInfo, city: e.target.value })
                }
                placeholder="City"
                required
              />
            </div>

            {/* State/Province */}
            <div className="col-span-3">
              <InputField
                label="State/Province *"
                name="state"
                value={cardInfo.state}
                onChange={(e) =>
                  setCardInfo({ ...cardInfo, state: e.target.value })
                }
                placeholder="State/Province"
                required
              />
            </div>

            {/* Postal Code */}
            <div className="col-span-3">
              <InputField
                label="Postal Code *"
                name="postalCode"
                value={cardInfo.postalCode}
                onChange={(e) =>
                  setCardInfo({ ...cardInfo, postalCode: e.target.value })
                }
                placeholder="Postal code"
                required
              />
            </div>

            {/* Country */}
            <div className="col-span-3">
              <Dropdown
                label="Country *"
                name="country"
                value={cardInfo.country}
                onChange={(e) =>
                  setCardInfo({ ...cardInfo, country: e.target.value })
                }
                options={[
                  { label: "Canada", value: "CA" },
                  { label: "United States", value: "US" },
                ]}
                required
              />
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
