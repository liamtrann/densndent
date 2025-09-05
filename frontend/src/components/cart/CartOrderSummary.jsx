// src/components/cart/CartOrderSummary.jsx
import React from "react";
import { Dropdown, InputField } from "common";
import Button from "@/common/ui/Button";
import Paragraph from "@/common/ui/Paragraph";
import {
  calculateTotalCurrency,
  validatePostalCode,
  handleTaxShippingEstimate,
} from "config";
import ToastNotification from "@/common/toast/Toast";
import { EstimateTotal } from "components";

export default function CartOrderSummary({
  totalQuantity,
  subtotal,
  postalCode,
  setPostalCode,
  handleProceedToCheckout,
  inventoryLoading,
}) {
  const [country, setCountry] = React.useState("ca");
  const [estimatedTax, setEstimatedTax] = React.useState(null);
  const [shippingCost, setShippingCost] = React.useState(null);
  const [taxRate, setTaxRate] = React.useState(null);
  const [postalCodeError, setPostalCodeError] = React.useState("");

  const handlePostalCodeChange = (e) => {
    const value = e.target.value;
    setPostalCode(value);
    setPostalCodeError("");
    const error = validatePostalCode(value, country);
    setPostalCodeError(error);
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    if (postalCode) {
      const error = validatePostalCode(postalCode, selectedCountry);
      setPostalCodeError(error);
    }
  };

  const handleEstimate = async () => {
    let toastId;
    const result = await handleTaxShippingEstimate({
      country,
      postalCode,
      subtotal,
      onSuccess: (message, data) => {
        ToastNotification.success(message);
        setEstimatedTax(data.estimatedTax);
        setShippingCost(data.shippingCost);
        setTaxRate(data.taxRate);
      },
      onError: (errorMessage) => {
        setPostalCodeError(errorMessage);
        ToastNotification.error(errorMessage);
      },
      onLoading: (message) => {
        toastId = ToastNotification.loading(message);
      },
      onDismiss: () => {
        if (toastId) ToastNotification.dismiss(toastId);
      },
    });

    if (!result.success) {
      setEstimatedTax(null);
      setShippingCost(null);
      setTaxRate(null);
    }
  };

  const estimateDisabled = !!postalCodeError || !postalCode.trim();

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

      <div className="flex justify-between items-center py-2 border-t border-gray-200 text-base font-semibold">
        <span className="text-gray-700">
          Subtotal {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
        </span>
        <span className="text-gray-900">
          {calculateTotalCurrency(subtotal, 1, "$")}
        </span>
      </div>

      <Paragraph className="text-xs text-gray-500 mb-4">
        Subtotal Does Not Include Shipping Or Tax
      </Paragraph>

      <div className="mb-4">
        <h4 className="text-sm font-medium mb-1">Estimate Tax & Shipping</h4>
        <Paragraph className="text-xs mb-2">
          Ship available only to Canada or USA
        </Paragraph>

        <div className="flex gap-2 mb-2">
          <Dropdown
            options={[
              { value: "ca", label: "Canada" },
              { value: "us", label: "USA" },
            ]}
            value={country}
            onChange={handleCountryChange}
            className="min-w-[110px]"
          />
          <div className="flex-1">
            <InputField
              placeholder={country === "ca" ? "A1A 1A1" : "12345 or 12345-6789"}
              value={postalCode}
              onChange={handlePostalCodeChange}
              error={postalCodeError}
            />
          </div>
        </div>

        <Button
          className="w-full py-2"
          variant="secondary"
          onClick={handleEstimate}
          disabled={estimateDisabled}
        >
          ESTIMATE
        </Button>

        {estimatedTax !== null && (
          <EstimateTotal
            subtotal={subtotal}
            shippingCost={shippingCost}
            estimatedTax={estimatedTax}
            taxRate={taxRate}
            currency="$"
            showBreakdown={true}
          />
        )}
      </div>

      <Button
        className="w-full mt-4 py-3"
        variant="primary"
        onClick={handleProceedToCheckout}
        disabled={inventoryLoading}
      >
        PROCEED TO CHECKOUT
      </Button>
    </div>
  );
}
