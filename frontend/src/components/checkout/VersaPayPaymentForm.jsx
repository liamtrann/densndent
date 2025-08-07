// src/components/checkout/VersaPayPaymentForm.jsx
import React, { useState } from "react";
import VersaPayCheckout from "../payment/VersaPayCheckout";
import { useVersaPay } from "../../hooks/useVersaPay";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCartSubtotalWithDiscounts } from "@/redux/slices";

const VersaPayPaymentForm = ({
  selectedAddress,
  shippingCost = 0,
  estimatedTax = 0,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const userInfo = useSelector((state) => state.user.info);
  const subtotal = useSelector((state) =>
    selectCartSubtotalWithDiscounts(state, cart)
  );

  const total = subtotal + shippingCost + estimatedTax;

  // Prepare order data for VersaPay
  const orderData = {
    id: `order-${Date.now()}`,
    customerId: userInfo?.sub || "guest",
    customerName: userInfo?.name || "Guest User",
    customerEmail: userInfo?.email || "",
    totalAmount: total,
    currency: "CAD",
    items: cart.map((item) => ({
      itemId: item.id || item.productId,
      quantity: item.quantity,
      price: item.discountedPrice || item.price,
      rate: item.discountedPrice || item.price,
      name: item.name || item.title,
      description: item.description || "",
    })),
    billingAddress: selectedAddress
      ? {
          contactFirstName:
            selectedAddress.firstName || userInfo?.given_name || "",
          contactLastName:
            selectedAddress.lastName || userInfo?.family_name || "",
          companyName: selectedAddress.company || "",
          address1: selectedAddress.address || selectedAddress.street || "",
          address2: selectedAddress.address2 || "",
          city: selectedAddress.city || "",
          stateOrProvince:
            selectedAddress.state || selectedAddress.province || "",
          postCode: selectedAddress.zip || selectedAddress.postalCode || "",
          country: selectedAddress.country || "CA",
          phone: selectedAddress.phone || "",
          email: userInfo?.email || "",
        }
      : null,
    shippingAddress: selectedAddress
      ? {
          contactFirstName:
            selectedAddress.firstName || userInfo?.given_name || "",
          contactLastName:
            selectedAddress.lastName || userInfo?.family_name || "",
          companyName: selectedAddress.company || "",
          address1: selectedAddress.address || selectedAddress.street || "",
          address2: selectedAddress.address2 || "",
          city: selectedAddress.city || "",
          stateOrProvince:
            selectedAddress.state || selectedAddress.province || "",
          postCode: selectedAddress.zip || selectedAddress.postalCode || "",
          country: selectedAddress.country || "CA",
          phone: selectedAddress.phone || "",
          email: userInfo?.email || "",
        }
      : null,
    subtotal,
    shippingAmount: shippingCost,
    taxAmount: estimatedTax,
  };

  // Initialize VersaPay session
  const {
    sessionId,
    loading: sessionLoading,
    error: sessionError,
    refreshSession,
  } = useVersaPay(orderData);

  const handlePaymentSuccess = (result) => {
    console.log("VersaPay payment successful:", result);

    if (onPaymentSuccess) {
      onPaymentSuccess(result);
    } else {
      // Default behavior - navigate to confirmation
      navigate("/checkout/confirmation", {
        state: {
          orderId: result.orderId,
          transactionId: result.transactionId,
          orderData,
        },
      });
    }
  };

  const handlePaymentError = (error) => {
    console.error("VersaPay payment failed:", error);

    if (onPaymentError) {
      onPaymentError(error);
    }
  };

  // Show loading state while session is being created
  if (sessionLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Information</h3>
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Initializing secure payment system...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if session creation failed
  if (sessionError) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Information</h3>
        <div className="bg-white border rounded-lg p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-400 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3">
                <p className="text-red-800 font-medium">
                  Failed to initialize payment system
                </p>
                <p className="text-red-600 text-sm mt-1">{sessionError}</p>
                <button
                  onClick={refreshSession}
                  className="mt-2 text-sm text-red-600 underline hover:text-red-800"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Validate required data
  if (!selectedAddress) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Information</h3>
        <div className="bg-white border rounded-lg p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-400 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div className="ml-3">
                <p className="text-yellow-800 font-medium">Address Required</p>
                <p className="text-yellow-600 text-sm mt-1">
                  Please select or add a billing address before proceeding with
                  payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Information</h3>

      {/* Payment Summary */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Payment Summary</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {shippingCost > 0 && (
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
          )}
          {estimatedTax > 0 && (
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${estimatedTax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold border-t pt-1">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* VersaPay Payment Form */}
      <div className="bg-white border rounded-lg p-6">
        {sessionId && (
          <VersaPayCheckout
            sessionId={sessionId}
            orderData={orderData}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            className="w-full"
            styles={{
              // Custom styles to match your theme
              html: {
                "font-family": "system-ui, -apple-system, sans-serif",
              },
              input: {
                "font-size": "16px",
                color: "#374151",
                border: "1px solid #d1d5db",
                "border-radius": "6px",
                padding: "12px",
                "background-color": "#ffffff",
                transition: "border-color 0.2s",
              },
              "input:focus": {
                "border-color": "#3b82f6",
                outline: "none",
                "box-shadow": "0 0 0 3px rgba(59, 130, 246, 0.1)",
              },
              select: {
                "font-size": "16px",
                color: "#374151",
                border: "1px solid #d1d5db",
                "border-radius": "6px",
                padding: "12px",
                "background-color": "#ffffff",
              },
              label: {
                "font-size": "14px",
                "font-weight": "500",
                color: "#374151",
                "margin-bottom": "4px",
              },
            }}
          />
        )}
      </div>

      {/* Security notice */}
      <div className="text-center">
        <div className="inline-flex items-center text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-full">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>
            256-bit SSL encryption • PCI DSS compliant • Powered by VersaPay
          </span>
        </div>
      </div>
    </div>
  );
};

export default VersaPayPaymentForm;
