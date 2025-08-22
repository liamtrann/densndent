import { useState, useEffect, useCallback } from "react";

import api from "api/api";
import endpoints from "api/endpoints";
import { Button } from "common";

export default function SavedPaymentMethods({
  customerId,
  onSelectPaymentMethod,
  selectedPaymentMethodId,
  showTitle = true,
}) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoints.GET_PAYMENT_METHODS(customerId));
      setPaymentMethods(response.data.paymentMethods || []);
    } catch (err) {
      setError("Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (customerId) {
      fetchPaymentMethods();
    }
  }, [customerId, fetchPaymentMethods]);

  const handleRemovePaymentMethod = async (paymentMethodId) => {
    try {
      await api.delete(endpoints.DELETE_PAYMENT_METHOD(paymentMethodId));
      setPaymentMethods((prev) =>
        prev.filter((pm) => pm.id !== paymentMethodId)
      );

      // If the removed method was selected, clear selection
      if (selectedPaymentMethodId === paymentMethodId) {
        onSelectPaymentMethod(null);
      }
    } catch (err) {
      setError("Failed to remove payment method");
    }
  };

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

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      {showTitle && (
        <h3 className="text-lg font-semibold mb-4">Saved Payment Methods</h3>
      )}

      {paymentMethods.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          <div className="text-4xl mb-2">💳</div>
          <div>No payment methods saved</div>
          <div className="text-sm">Add a payment method to get started</div>
        </div>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((pm) => (
            <div
              key={pm.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedPaymentMethodId === pm.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => onSelectPaymentMethod(pm.id, pm)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedPaymentMethodId === pm.id}
                    onChange={() => onSelectPaymentMethod(pm.id, pm)}
                    className="text-blue-600"
                  />
                  <div>
                    <div className="font-medium">
                      {formatCardBrand(pm.card.brand)} •••• {pm.card.last4}
                    </div>
                    <div className="text-sm text-gray-500">
                      Expires {pm.card.exp_month.toString().padStart(2, "0")}/
                      {pm.card.exp_year}
                    </div>
                    {pm.billing_details?.name && (
                      <div className="text-sm text-gray-500">
                        {pm.billing_details.name}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePaymentMethod(pm.id);
                  }}
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
