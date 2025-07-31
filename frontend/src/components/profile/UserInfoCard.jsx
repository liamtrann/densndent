// src/components/UserInfoCard.jsx
import React, { useState } from "react";
import SettingsCard from "./SettingsCard";
import { CreateAddressModal } from "common";
import ProfileEditCard from "./ProfileEditCard";

export default function UserInfoCard({ customer }) {
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

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
            ? "Update Address"
            : "Create New Address"
        }
        onAction={(e) => {
          e.preventDefault();
          setShowAddressModal(true);
        }}
      />

      <SettingsCard
        title="Payment"
        description="We have no default credit card on file for this account."
        actionLabel="Add a Credit Card"
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
            <button
              onClick={() => setShowEditProfileModal(false)}
              className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <ProfileEditCard onClose={() => setShowEditProfileModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
