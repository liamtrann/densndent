import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateStripeCustomerId } from "store/slices/userSlice";

import { CreateAddressModal, CloseButton } from "common";
import Toast from "common/toast/Toast";

import AddPaymentMethod from "../checkout/AddPaymentMethod";
import SavedPaymentMethods from "../checkout/SavedPaymentMethods";
import StripeWrapper from "../stripe/StripeWrapper";

import ProfileEditCard from "./ProfileEditCard";
import SettingsCard from "./SettingsCard";

import { api, ENDPOINTS } from "@/api";

export default function UserInfoCard({ customer }) {
  const userInfo = useSelector((state) => state.user.info);
  const { getAccessTokenSilently } = useAuth0();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [paymentMethodsKey, setPaymentMethodsKey] = useState(0);
  const dispatch = useDispatch();
  const handleSelectPaymentMethod = (paymentMethodId) => {
    setSelectedPaymentMethodId(paymentMethodId);
  };

  const handlePaymentMethodAdded = (paymentMethod) => {
    setShowPaymentModal(false);
    setSelectedPaymentMethodId(paymentMethod.id);
    setPaymentMethodsKey((prev) => prev + 1); // Force re-render of SavedPaymentMethods
    Toast.success("Payment method added successfully!");
  };

  const handleCreateStripeCustomer = async () => {
    if (!userInfo?.email) {
      Toast.error("Please ensure your profile has email and name information.");
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const response = await api.post(
        ENDPOINTS.POST_CREATE_STRIPE_CUSTOMER(),
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
        setPaymentMethodsKey((prev) => prev + 1); // Force re-render of SavedPaymentMethods
        Toast.success("Stripe customer account created successfully!");
      }
    } catch (error) {
      Toast.error("Failed to create payment account. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SettingsCard
        title="Profile"
        description={
          <>
            <div>
              {[customer?.firstname, customer?.lastname]
                .filter(Boolean)
                .join(" ")}
            </div>
            <div>{customer?.email}</div>
            {customer?.entityid && <div>Customer #: {customer.entityid}</div>}
          </>
        }
        actionLabel={customer ? undefined : "Create Profile"}
        onAction={
          customer
            ? undefined
            : (e) => {
                e.preventDefault();
                setShowEditProfileModal(true);
              }
        }
      />

      {/* Address Card */}
      <SettingsCard
        title="Addresses"
        description={
          <>
            {customer?.shipping_address_name && (
              <div className="mb-2">
                <div className="font-semibold">Shipping Address</div>
                {customer.shipping_address_name.split("\n").map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            )}
            {customer?.billing_address_name && (
              <div>
                <div className="font-semibold">Billing Address</div>
                <div>{customer.billing_address_name}</div>
                {customer.billing_city ||
                customer.billing_state ||
                customer.billing_zip ? (
                  <div>
                    {[
                      customer.billing_city,
                      customer.billing_state,
                      customer.billing_zip,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                ) : null}
                {customer.billing_country && (
                  <div>{customer.billing_country}</div>
                )}
              </div>
            )}
            {!customer?.shipping_address_name &&
              !customer?.billing_address_name && (
                <div>We have no default address on file for this account.</div>
              )}
          </>
        }
        actionLabel={
          customer?.shipping_address_name || customer?.billing_address_name
            ? "Update "
            : "Create New Address"
        }
        onAction={(e) => {
          e.preventDefault();
          setShowAddressModal(true);
        }}
      />

      <SettingsCard
        title="Payment"
        description={
          <StripeWrapper>
            <div>
              {userInfo?.stripeCustomerId ? (
                <div>
                  <SavedPaymentMethods
                    key={paymentMethodsKey}
                    customerId={userInfo.stripeCustomerId}
                    onSelectPaymentMethod={handleSelectPaymentMethod} // No selection needed in profile
                    selectedPaymentMethodId={selectedPaymentMethodId}
                    showTitle={false}
                  />
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <div className="text-center text-gray-500">
                    <div className="text-lg mb-2">No Stripe Account Found</div>
                    <div className="text-sm mb-4">
                      You need a Stripe customer account to manage payment
                      methods.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </StripeWrapper>
        }
        actionLabel={
          userInfo?.stripeCustomerId ? "Add a Card" : "Create a Stripe Account"
        }
        onAction={() => {
          userInfo?.stripeCustomerId
            ? setShowPaymentModal(true)
            : handleCreateStripeCustomer();
        }}
      />

      {/* Address Modal */}
      {showAddressModal && (
        <CreateAddressModal
          onClose={() => setShowAddressModal(false)}
          onAddressCreated={() => setShowAddressModal(false)}
          address={
            customer?.shipping_address_name || customer?.billing_address_name
              ? {
                  address1: customer?.shipping_addr1 || "",
                  city: customer?.shipping_city || customer?.billing_city || "",
                  state:
                    customer?.shipping_state || customer?.billing_state || "",
                  zip: customer?.shipping_zip || customer?.billing_zip || "",
                  defaultBilling: !!customer?.billing_address_name,
                  defaultShipping: !!customer?.shipping_address_name,
                }
              : null
          }
          mode={
            customer?.shipping_address_name || customer?.billing_address_name
              ? "update"
              : "create"
          }
          customerId={customer?.id}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && !customer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-xl relative">
            <CloseButton onClick={() => setShowEditProfileModal(false)} />
            <ProfileEditCard onClose={() => setShowEditProfileModal(false)} />
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative m-4">
            <CloseButton
              onClick={() => setShowPaymentModal(false)}
              className="z-10"
            />

            <StripeWrapper>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Add Payment Method</h2>

                {setShowPaymentModal ? (
                  <AddPaymentMethod
                    customerId={userInfo.stripeCustomerId}
                    onPaymentMethodAdded={handlePaymentMethodAdded}
                    onCancel={() => setShowPaymentModal(false)}
                  />
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500 mb-4">
                      No Stripe customer account found. Please set up your
                      account first.
                    </div>
                  </div>
                )}
              </div>
            </StripeWrapper>
          </div>
        </div>
      )}
    </div>
  );
}
