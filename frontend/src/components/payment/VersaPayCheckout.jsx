// src/components/payment/VersaPayCheckout.jsx
import React, { useEffect, useRef, useState } from "react";
import versaPayService from "../../services/versaPayService";

const VersaPayCheckout = ({
  sessionId,
  onPaymentSuccess,
  onPaymentError,
  orderData,
  className = "",
  styles = {},
  fontUrls = [],
}) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [client, setClient] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Session ID is required");
      return;
    }

    // Check if VersaPay script is loaded
    if (typeof window.versapay === "undefined") {
      setError(
        "VersaPay SDK not loaded. Please check the script tag in index.html"
      );
      return;
    }

    initializeVersaPay();
  }, [sessionId]);

  const initializeVersaPay = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Default styles for a clean look
      const defaultStyles = {
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
        ...styles,
      };

      // Initialize the VersaPay client
      const versaPayClient = await window.versapay.initClient(
        sessionId,
        defaultStyles,
        fontUrls
      );

      setClient(versaPayClient);

      // Calculate responsive container dimensions
      const containerWidth = window.innerWidth > 500 ? "500px" : "100%";
      const containerHeight = "358px";

      // Initialize the iframe
      const frameReadyPromise = versaPayClient.initFrame(
        containerRef.current,
        containerHeight,
        containerWidth
      );

      // Set up approval callbacks
      versaPayClient.onApproval(
        (result) => {
          // Payment method approved - token received
          console.log("Payment approved:", result);
          handlePaymentSuccess(result);
        },
        (error) => {
          // Payment method rejected
          console.error("Payment error:", error);
          setError(error.error || "Payment was rejected");
          setIsProcessing(false);
          if (onPaymentError) {
            onPaymentError(error);
          }
        }
      );

      // Wait for iframe to be ready
      await frameReadyPromise;
      setIsLoading(false);
    } catch (err) {
      console.error("Error initializing VersaPay:", err);
      setError("Failed to initialize payment form");
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (result) => {
    try {
      // Send the token and order data to your backend using VersaPay service
      const response = await versaPayService.processPayment(
        sessionId,
        orderData,
        result.token
      );

      if (response.success) {
        setIsProcessing(false);
        if (onPaymentSuccess) {
          onPaymentSuccess({
            orderId: response.orderId,
            finalized: response.finalized,
            payment: response.payment,
            paymentToken: result.token,
            paymentType: result.paymentType,
          });
        }
      } else {
        throw new Error(response.message || "Payment processing failed");
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      setError(err.message || "Payment processing failed");
      setIsProcessing(false);
      if (onPaymentError) {
        onPaymentError(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!client) {
      setError("Payment form not ready");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Trigger the VersaPay form submission
      await client.submitEvents();
    } catch (err) {
      console.error("Error submitting payment:", err);
      setError("Failed to submit payment");
      setIsProcessing(false);
    }
  };

  if (!sessionId) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">
          Session ID is required to initialize payment form
        </p>
      </div>
    );
  }

  return (
    <div className={`versapay-checkout ${className}`}>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Loading secure payment form...
            </span>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* VersaPay Iframe Container */}
        <div
          ref={containerRef}
          className={`versapay-container ${isLoading ? "hidden" : ""}`}
          style={{
            minHeight: "358px",
            width: "100%",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        />

        {/* Submit Button */}
        {!isLoading && (
          <div className="flex flex-col space-y-2">
            <button
              type="submit"
              disabled={isProcessing || isLoading}
              className={`
                w-full py-3 px-6 rounded-lg font-medium text-white
                ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }
                transition-colors duration-200
              `}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing Payment...
                </span>
              ) : (
                "Complete Payment"
              )}
            </button>

            {/* Security Notice */}
            <div className="flex items-center justify-center text-xs text-gray-500 space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Secured by VersaPay - PCI Compliant</span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default VersaPayCheckout;
