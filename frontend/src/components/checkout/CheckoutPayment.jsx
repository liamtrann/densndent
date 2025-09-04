import { useAuth0 } from "@auth0/auth0-react";
import AddressModal from "common/modals/AddressModal";
import AddressCard from "common/ui/AddressCard";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateStripeCustomerId } from "store/slices/userSlice";

import api from "api/api";
import endpoints from "api/endpoints";
import { Button } from "common";
import ToastNotification from "common/toast/Toast";

import StripeWrapper from "../stripe/StripeWrapper";

import AddPaymentMethod from "./AddPaymentMethod";
import SavedPaymentMethods from "./SavedPaymentMethods";

export default function CheckoutPayment({
  isAddModalOpen,
  setAddModalOpen,
  addresses,
  setAddresses,
  selectedId,
  setSelectedId,
  onCustomerIdChange,
}) {
  const userInfo = useSelector((state) => state.user.info);
  const stripeCustomerId = userInfo?.stripeCustomerId;
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Payment method states
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Set payment method based on user status
  useEffect(() => {
    if (userInfo?.searchstage !== "Customer") {
      setPaymentMethod("card");
    }
  }, [userInfo?.searchstage]);

  // Notify parent component when stripeCustomerId changes
  useEffect(() => {
    if (onCustomerIdChange) {
      onCustomerIdChange(stripeCustomerId);
    }
  }, [stripeCustomerId, onCustomerIdChange]);

  // Save addresses and selectedId to localStorage whenever they change
  useEffect(() => {
    if (addresses.length > 0) {
      localStorage.setItem("checkoutAddresses", JSON.stringify(addresses));
    }
    if (selectedId) {
      localStorage.setItem("selectedAddressId", selectedId.toString());
    }
  }, [addresses, selectedId]);

  const handleSelectAddress = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefaultShipping: addr.id === id,
      }))
    );
    setSelectedId(id);
  };

  const handleRemoveAddress = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    if (selectedId === id && addresses.length > 1) {
      setSelectedId(addresses[0].id);
    }
  };

  const handleSaveAddress = (newAddress) => {
    const id = Date.now();
    const formatted = {
      ...newAddress,
      id,
      isDefaultShipping: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, formatted]);

    if (addresses.length === 0) {
      setSelectedId(id);
    }

    setAddModalOpen(false);
  };

  const handlePaymentMethodAdded = (paymentMethod) => {
    setShowAddPaymentMethod(false);
    setSelectedPaymentMethodId(paymentMethod.id);
  };

  const handleSelectPaymentMethod = (paymentMethodId) => {
    setSelectedPaymentMethodId(paymentMethodId);
  };

  const handleCreateStripeCustomer = async () => {
    if (!userInfo?.email) {
      ToastNotification.error(
        "Please ensure your profile has email and name information."
      );
      return;
    }

    setCustomerLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await api.post(
        endpoints.POST_CREATE_STRIPE_CUSTOMER(),
        {
          email: userInfo.email,
          name: `${userInfo.firstname} ${userInfo.lastname}`,
          // Add any other user info you want to include
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.customerId) {
        dispatch(updateStripeCustomerId(response.data.customerId));
      }
    } catch (error) {
      ToastNotification.error(
        "Failed to create payment account. Please try again."
      );
    } finally {
      setCustomerLoading(false);
    }
  };

  return (
    <StripeWrapper>
      <div className="space-y-6">
        {/* Address List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              isSelected={addr.id === selectedId}
              onSelect={() => handleSelectAddress(addr.id)}
              onRemove={() => handleRemoveAddress(addr.id)}
            />
          ))}

          {/* Add Address Card */}
          <div
            className="border rounded shadow-sm p-4 flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100"
            onClick={() => setAddModalOpen(true)}
          >
            <div className="text-center text-gray-500">
              <div className="text-3xl">＋</div>
              <div>Add Address</div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="border rounded shadow-sm p-4 bg-white space-y-4">
          <h3 className="font-semibold mb-2">Payment Method</h3>

          {/* Tabs */}
          <div className="flex space-x-4 border-b mb-4">
            <button
              className={`py-2 px-4 font-medium ${
                paymentMethod === "card"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              Credit/Debit Card
            </button>
            {userInfo?.searchstage === "Customer" && (
              <button
                className={`py-2 px-4 font-medium ${
                  paymentMethod === "invoice"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
                onClick={() => setPaymentMethod("invoice")}
              >
                Invoice
              </button>
            )}
          </div>

          {/* Invoice Message */}
          {paymentMethod === "invoice" && (
            <div className="text-sm text-gray-700">
              An invoice will be emailed to the billing address after the order
              is confirmed.
            </div>
          )}

          {/* Credit/Debit Card Content - Show Payment Methods Section */}
          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium">Saved Payment Methods</h4>
                {!showAddPaymentMethod && stripeCustomerId && (
                  <Button
                    variant="outline"
                    onClick={() => setShowAddPaymentMethod(true)}
                    disabled={customerLoading}
                  >
                    Add Payment Method
                  </Button>
                )}
              </div>

              {customerLoading ? (
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-16 bg-gray-200 rounded"></div>
                      <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ) : !stripeCustomerId ? (
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <div className="text-center text-gray-500">
                    <div className="text-lg mb-2">No Stripe Account Found</div>
                    <div className="text-sm mb-4">
                      You need a Stripe customer account to manage payment
                      methods.
                    </div>
                    <Button
                      onClick={handleCreateStripeCustomer}
                      disabled={customerLoading}
                    >
                      {customerLoading
                        ? "Creating..."
                        : "Create Payment Account"}
                    </Button>
                  </div>
                </div>
              ) : showAddPaymentMethod ? (
                <AddPaymentMethod
                  customerId={stripeCustomerId}
                  onPaymentMethodAdded={handlePaymentMethodAdded}
                  onCancel={() => setShowAddPaymentMethod(false)}
                />
              ) : (
                <SavedPaymentMethods
                  customerId={stripeCustomerId}
                  onSelectPaymentMethod={handleSelectPaymentMethod}
                  selectedPaymentMethodId={selectedPaymentMethodId}
                  showTitle={false}
                />
              )}
            </div>
          )}
        </div>

        {/* Delivery Method */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-semibold mb-2">Delivery Method</h3>
          <label className="flex items-center border p-3 rounded cursor-pointer hover:border-orange-400 transition">
            <input
              type="radio"
              name="delivery"
              defaultChecked
              className="mr-3"
            />
            <div className="text-sm">
              <div>ICS Ground – Online</div>
              <div className="text-gray-500 text-xs">$9.99</div>
            </div>
          </label>
        </div>

        {/* Continue to Review */}
        <div className="flex justify-end">
          <Button
            className="px-6 py-3"
            onClick={() => {
              // Validate required fields and show appropriate toast messages
              if (!selectedId) {
                ToastNotification.error("Please select a shipping address.");
                return;
              }

              if (paymentMethod === "card") {
                if (!stripeCustomerId) {
                  ToastNotification.error(
                    "Please create a payment account first."
                  );
                  return;
                }
                if (!selectedPaymentMethodId) {
                  ToastNotification.error(
                    "Please select or add a payment method."
                  );
                  return;
                }
              }

              // Save selected payment method and payment type to localStorage for the next step
              localStorage.setItem(
                "selectedPaymentMethodId",
                selectedPaymentMethodId || ""
              );
              localStorage.setItem("paymentMethod", paymentMethod);
              navigate("/checkout/review");
            }}
          >
            Continue to Review
          </Button>
        </div>

        {/* Address Modal */}
        <AddressModal
          isOpen={isAddModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSave={handleSaveAddress}
        />
      </div>
    </StripeWrapper>
  );
}
