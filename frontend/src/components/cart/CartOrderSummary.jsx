import React from "react";
import { Dropdown, InputField } from "common";
import { formatPrice, calculateTotalCurrency } from "../../config/config";
import ToastNotification from "../../common/toast/Toast";
import endpoint from "api/endpoints";
import api from "api/api";

export default function CartOrderSummary({
  totalQuantity,
  subtotal,
  postalCode,
  setPostalCode,
  promoCode,
  setPromoCode,
  handleProceedToCheckout,
  inventoryLoading,
}) {
  const [country, setCountry] = React.useState("ca");
  const [estimatedTax, setEstimatedTax] = React.useState(null);
  const [shippingCost, setShippingCost] = React.useState(null);
  const [taxRate, setTaxRate] = React.useState(null);
  const { fetchRegionByCode } = require("../../config/config.js");

  const handleEstimate = async () => {
    const toastId = ToastNotification.loading("Estimating region...");
    try {
      setEstimatedTax(null);
      setShippingCost(null);
      setTaxRate(null);
      const result = await fetchRegionByCode(country, postalCode);
      ToastNotification.dismiss(toastId);

      if (result) {
        const province =
          result.places[0]?.state || result.places[0]?.state_abbreviation;
        if (province) {
          const taxUrl = endpoint.GET_TAX_RATES({ country, province });
          const taxRates = await api.get(taxUrl);
          ToastNotification.success("Tax rates loaded!");
          // Calculate estimated tax
          const totalTaxRate = taxRates.data?.rates?.total;
          setTaxRate(totalTaxRate);
          if (totalTaxRate && subtotal) {
            const taxAmount = Number(subtotal) * Number(totalTaxRate);
            setEstimatedTax(taxAmount);
          } else {
            setEstimatedTax(null);
          }
          // Get shipping cost
          const shippingRes = await api.get(
            endpoint.GET_SHIPPING_METHOD(20412)
          );
          const shippingAmount = shippingRes.data?.shippingflatrateamount;
          setShippingCost(shippingAmount ?? 9.99);
        } else {
          ToastNotification.error("Province not found in region lookup.");
        }
      } else {
        ToastNotification.error(result?.error || "Region lookup failed.");
      }
    } catch (err) {
      ToastNotification.dismiss(toastId);
      ToastNotification.error(err.message || "Region lookup failed.");
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
              onChange={(e) => setCountry(e.target.value)}
              className="min-w-[100px]"
            />
            <InputField
              placeholder="Post Code / Zip Code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <button
            className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800"
            onClick={handleEstimate}
          >
            ESTIMATE
          </button>
          {estimatedTax !== null && (
            <React.Fragment>
              {/* Estimated Tax Row */}
              <div className="flex justify-between items-center py-2 border-t border-gray-200 text-base font-semibold">
                <span className="text-gray-700 flex items-center gap-2">
                  Estimated Tax
                  {taxRate && (
                    <span className="text-xs text-gray-500">
                      ({(taxRate * 100).toFixed(2)}%)
                    </span>
                  )}
                </span>
                <span className="text-gray-900">
                  {calculateTotalCurrency(estimatedTax, 1, "$")}
                </span>
              </div>
              {/* Shipping Row */}
              <div className="flex justify-between items-center py-2 border-t border-gray-200 text-base font-semibold">
                <span className="text-gray-700">Shipping</span>
                <span className="text-gray-900">
                  {calculateTotalCurrency(
                    shippingCost !== null ? shippingCost : 9.99,
                    1,
                    "$"
                  )}
                </span>
              </div>
              {/* Estimated Total Row */}
              <div className="flex justify-between items-center py-2 border-t border-gray-300 text-lg font-bold">
                <span className="text-gray-800">Estimated Total</span>
                <span className="text-black-800">
                  {calculateTotalCurrency(
                    Number(subtotal) +
                      Number(estimatedTax) +
                      Number(shippingCost ?? 9.99),
                    1,
                    "$"
                  )}
                </span>
              </div>
            </React.Fragment>
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
