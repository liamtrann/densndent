import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "store/slices/cartSlice";

import api from "api/api";
import endpoint from "api/endpoints";
import { Loading } from "common";
import ToastNotification from "common/toast/Toast";
import Button from "common/ui/Button";
import {
  buildIdempotencyKey,
  calculateNextRunDate,
  formatPrice,
} from "config/config";

import StripeCheckout from "./StripeCheckout";

import { SHIPPING_METHOD } from "@/constants/constant";

export default function CheckoutReview({
  stripeCustomerId,
  orderTotal,
  isProcessing,
  setIsProcessing,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const userInfo = useSelector((state) => state.user.info);
  const cartItems = useSelector((state) => state.cart.items || []);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("invoice");
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("checkoutAddresses") || "[]"
    );
    const selected = Number(localStorage.getItem("selectedAddressId"));
    const selectedAddress = stored.find((addr) => addr.id === selected);
    setBillingAddress(selectedAddress);

    // Get payment method and selected payment method ID from localStorage
    const storedPaymentMethod = localStorage.getItem("paymentMethod");
    const storedPaymentMethodId = localStorage.getItem(
      "selectedPaymentMethodId"
    );

    if (storedPaymentMethod) {
      setPaymentMethod(storedPaymentMethod);
    }
    if (storedPaymentMethodId) {
      setSelectedPaymentMethodId(storedPaymentMethodId);
    }
  }, []);

  // Build order payload for NetSuite integration
  const buildOrderPayload = () => {
    // Validate required data
    if (!userInfo?.id || !cartItems?.length || !billingAddress) {
      return null;
    }

    return {
      entity: {
        id: userInfo.id,
        // type: userInfo.searchstage,
      },
      item: {
        items: cartItems.map((item) => ({
          item: {
            id: item.id,
          },
          quantity: item.quantity,
        })),
      },
      tobeEmailed: true,
      email: userInfo.email,
      shipMethod: {
        id: SHIPPING_METHOD,
      },
      billingAddress: {
        addr1: billingAddress.line1 || billingAddress.address,
        addressee: billingAddress.fullName,
        city: billingAddress.city,
        country: { id: "CA" },
        state: billingAddress.state,
        zip: billingAddress.postalCode || billingAddress.zip,
      },
      shippingAddress: sameAsShipping
        ? {
            addr1: billingAddress.line1 || billingAddress.address,
            addressee: billingAddress.fullName,
            city: billingAddress.city,
            country: { id: "CA" },
            state: billingAddress.state,
            zip: billingAddress.postalCode || billingAddress.zip,
          }
        : null,
      paymentMethod: paymentMethod,
    };
  };

  // Stripe Payment Functions
  const createPaymentIntent = async (selectedPaymentMethodId) => {
    if (!selectedPaymentMethodId || !orderTotal) return;

    try {
      const token = await getAccessTokenSilently();
      const response = await api.post(
        endpoint.POST_CREATE_PAYMENT(),
        {
          paymentMethod: selectedPaymentMethodId,
          amount: formatPrice(orderTotal),
          currency: "cad",
          customerId: stripeCustomerId,
          description: `Order payment for ${cartItems.length} item(s)`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.paymentIntent;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to create payment intent"
      );
    }
  };

  const handlePaymentSuccess = (paymentResult) => {
    // Handle successful payment
    localStorage.removeItem("selectedPaymentMethodId");
    localStorage.removeItem("paymentMethod");
    // Clear cart
    dispatch(clearCart());

    // Clear checkout addresses from localStorage
    localStorage.removeItem("checkoutAddresses");
    localStorage.removeItem("selectedAddressId");

    navigate("/purchase-history", {
      state: {
        paymentIntent: paymentResult,
        orderAmount: orderTotal,
        paymentSuccessMessage: "Payment completed successfully!",
      },
    });
  };

  const handlePaymentError = (error) => {
    ToastNotification.error(
      error.message || "Payment failed. Please try again."
    );
  };

  // If payment method is card, show StripeCheckout instead
  if (paymentMethod === "card") {
    return (
      <StripeCheckout
        stripeCustomerId={stripeCustomerId}
        orderTotal={orderTotal}
        createPaymentIntent={createPaymentIntent}
        handlePaymentSuccess={handlePaymentSuccess}
        handlePaymentError={handlePaymentError}
        buildOrderPayload={buildOrderPayload}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    );
  }

  const handlePlaceOrder = async () => {
    // Check if user ID is available
    if (!userInfo?.id) {
      ToastNotification.error(
        "User information not available. Please refresh the page and try again."
      );
      return;
    }

    // Check if user is a valid customer
    // if (userInfo.searchstage !== "Customer") {
    //   ToastNotification.error(
    //     "New customers must contact support to place orders. We only allow orders for existing customers. Please contact our support team."
    //   );
    //   return;
    // }

    // Check if billing address is available
    if (!billingAddress) {
      ToastNotification.error(
        "Please select a billing address before placing the order."
      );
      return;
    }

    // Check if cart has items
    if (!cartItems || cartItems.length === 0) {
      ToastNotification.error(
        "Your cart is empty. Please add items before placing an order."
      );
      return;
    }

    // Build order payload using the standardized function
    const orderPayload = buildOrderPayload();
    if (!orderPayload) {
      ToastNotification.error(
        "Unable to build order. Please check your information and try again."
      );
      return;
    }

    try {
      setIsProcessing(true);
      const token = await getAccessTokenSilently();

      // Build deterministic idempotency key matching backend window logic
      const idemKey = buildIdempotencyKey(
        userInfo,
        cartItems,
        SHIPPING_METHOD,
        10
      );

      const response = await api.post(
        endpoint.POST_SALES_ORDER(),
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Idempotency-Key": idemKey,
          },
        }
      );

      // Check if this is a duplicate order (from cache or NetSuite)
      if (response?.data?.isDuplicate === true) {
        ToastNotification.success(
          "Order already placed! To place the same order again, please wait 10 minutes."
        );
      } else {
        ToastNotification.success("Order placed successfully!");

        // Create recurring orders for subscription items ONLY if sales order was successful (not duplicate)
        const subscriptionItems = cartItems.filter(
          (item) =>
            item.subscriptionEnabled &&
            item.subscriptionInterval &&
            item.subscriptionUnit
        );

        if (subscriptionItems.length > 0) {
          for (const item of subscriptionItems) {
            try {
              const nextRunDate = calculateNextRunDate(
                item.subscriptionInterval,
                item.subscriptionUnit
              );

              const recurringOrderPayload = {
                name: `every ${item.subscriptionInterval} ${item.subscriptionUnit}`,
                custrecord_ro_customer: { id: userInfo.id },
                custrecord_ro_item: { id: item.id },
                custrecord_ro_quantity: Number(item.quantity),
                custrecord_ro_interval: Number(item.subscriptionInterval),
                custrecord_ro_interval_unit: { id: "2" },
                custrecord_ro_next_run: nextRunDate,
                custrecord_ro_status: { id: "1" },
              };

              await api.post(
                endpoint.POST_RECURRING_ORDER(),
                recurringOrderPayload,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              // Recurring order created successfully
            } catch (recurringError) {
              // Failed to create recurring order - don't show error to user since main order was successful
            }
          }

          if (subscriptionItems.length > 0) {
            ToastNotification.success(
              `Subscription set up for ${subscriptionItems.length} item(s)!`
            );
          }
        }
      }

      // Clear cart after successful order
      dispatch(clearCart());

      // Clear checkout addresses from localStorage
      localStorage.removeItem("checkoutAddresses");
      localStorage.removeItem("selectedAddressId");
      localStorage.removeItem("selectedPaymentMethodId");
      localStorage.removeItem("paymentMethod");

      // Redirect to order history
      navigate("/purchase-history");
    } catch (error) {
      // Handle order placement error
      ToastNotification.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
            <Loading text="Processing your order..." />
            <div className="mt-4 space-y-2">
              <p className="text-gray-700 font-medium">
                Please don't close this window
              </p>
              <p className="text-sm text-gray-600">
                We're creating your order and sending confirmation details. This
                may take a few minutes.
              </p>
              <p className="text-xs text-gray-500 mt-3">
                You'll be redirected to your order history once complete.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Billing Address */}
          {billingAddress && (
            <div className="border rounded shadow-sm p-4 bg-white">
              <h3 className="font-semibold mb-2">Billing Address</h3>
              <div className="text-sm space-y-1">
                <div className="font-semibold">{billingAddress.fullName}</div>
                <div>{billingAddress.address}</div>
                <div>
                  {[
                    billingAddress.city,
                    billingAddress.state,
                    billingAddress.zip,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
                <div>{billingAddress.country}</div>
                <div className="text-blue-700">
                  {billingAddress.phone || "Phone not available"}
                </div>
              </div>
            </div>
          )}

          {/* Same as Shipping */}
          <div className="text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={() => setSameAsShipping(!sameAsShipping)}
                className="mr-2"
              />
              Shipping address same as billing address
            </label>
          </div>

          {/* Payment Method Display */}
          <div className="border rounded shadow-sm p-4 bg-white">
            <h3 className="font-semibold mb-2">Payment Method</h3>
            <div className="text-sm text-gray-700">
              {paymentMethod === "invoice" ? (
                <>
                  <div className="font-medium">Invoice</div>
                  <div className="text-gray-600 mt-1">
                    An invoice will be emailed after order confirmation
                  </div>
                </>
              ) : (
                <>
                  <div className="font-medium">Credit/Debit Card</div>
                  <div className="text-gray-600 mt-1">
                    {selectedPaymentMethodId
                      ? `Payment method selected (ID: ${selectedPaymentMethodId.slice(-4)})`
                      : "Card payment method selected"}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={() => navigate("/checkout/payment")}
              disabled={isProcessing}
            >
              Back
            </Button>
            <Button onClick={handlePlaceOrder} disabled={isProcessing}>
              {isProcessing ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="hidden lg:block"></div>
      </div>
    </div>
  );
}
