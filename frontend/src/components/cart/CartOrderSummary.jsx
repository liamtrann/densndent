import React from "react";
import { Dropdown, InputField } from "common";
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

    // Clear previous error and validate
    setPostalCodeError("");
    const error = validatePostalCode(value, country);
    setPostalCodeError(error);
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);

    // Revalidate postal code for new country
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
      // Reset states on error
      setEstimatedTax(null);
      setShippingCost(null);
      setTaxRate(null);
    }
  };

  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2"></div>
      <div className="border p-6 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <div className="flex justify-between items-center py-2 border-t border-gray-200 text-base font-semibold">
          <span className="text-gray-700">
            Subtotal {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
          </span>
          <span className="text-gray-900">
            {calculateTotalCurrency(subtotal, 1, "$")}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Subtotal Does Not Include Shipping Or Tax
        </p>
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-1">Estimate Tax & Shipping</h4>
          <p className="text-xs mb-2">Ship available only to Canada or USA</p>
          <div className="flex gap-2 mb-2">
            <Dropdown
              options={[
                { value: "ca", label: "Canada" },
                { value: "us", label: "USA" },
              ]}
              value={country}
              onChange={handleCountryChange}
              className="min-w-[100px]"
            />
            <div className="flex-1">
              <InputField
                placeholder={
                  country === "ca" ? "A1A 1A1" : "12345 or 12345-6789"
                }
                value={postalCode}
                onChange={handlePostalCodeChange}
                error={postalCodeError}
              />
            </div>
          </div>
          <button
            className={`w-full py-2 rounded transition-colors ${
              postalCodeError || !postalCode.trim()
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-gray-800"
            }`}
            onClick={handleEstimate}
            disabled={postalCodeError || !postalCode.trim()}
          >
            ESTIMATE
          </button>
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
        <button
          className="w-full mt-4 bg-purple-800 text-white py-3 rounded hover:bg-purple-900"
          onClick={handleProceedToCheckout}
          disabled={inventoryLoading}
        >
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
}
