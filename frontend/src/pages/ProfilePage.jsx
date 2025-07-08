import React, { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import api from "../api/api";
import endpoint from "../api/endpoints";
import { RecentPurchases, SettingsCard, ProfileEditCard } from "../components";
import { CreateAddressModal, ErrorMessage, Loading } from "../common";

export default function ProfilePage() {
  const { user, getAccessTokenSilently } = useAuth0();

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reusable fetcher
  const fetchCustomer = useCallback(async () => {
    if (user?.email) {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const res = await api.get(endpoint.GET_CUSTOMER_BY_EMAIL(user.email), {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("👤 Customer Response:", res.data);

        const customerData = res.data[0] || null;
        setCustomer(customerData);
        setError(null);
      } catch (err) {
        setCustomer(null);
        setError(err.response?.data?.error || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
  }, [user?.email, getAccessTokenSilently]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  // Handler for creating profile
  const handleCreateProfile = async (newData) => {
    console.log(newData);
    const { firstName, lastName, homePhone, mobilePhone } = newData;
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      await api.post(
        endpoint.POST_CREATE_CUSTOMER(),
        {
          firstName: firstName,
          lastName: lastName,
          homePhone: homePhone,
          mobilePhone: mobilePhone,
          email: user.email,
          entityStatus: {
            id: 6
          },
          subsidiary: {
            id: 2
          },
          category: {
            id: 15
          },
          isPerson: true
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEditModal(false);
      fetchCustomer(); // Refresh data
    } catch (err) {
      console.log(err)
      setError("Failed to create profile.");
    } finally {
      setLoading(false);
    }
  };

  console.log(customer)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Recent Purchases</h2>
        <a
          href="/profile/history"
          className="text-sm text-blue-600 hover:underline"
        >
          View Purchase History →
        </a>
      </div>

      <RecentPurchases />

      <h2 className="text-lg font-semibold text-gray-800 mt-10 mb-4">My Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <SettingsCard
          title="Profile"
          description={
            <>
              <div>{[customer?.firstname, customer?.lastname].filter(Boolean).join(' ')}</div>
              <div>{customer?.email}</div>
              {customer?.entityid && <div>Customer #: {customer.entityid}</div>}
            </>
          }
          actionLabel={customer ? undefined : "Create Profile"}
          onAction={customer ? undefined : (e => {
            e.preventDefault();
            setShowEditModal(true);
          })}
        />

        {/* Address Card */}
        <SettingsCard
          title="Addresses"
          description={
            <>
              {customer?.shipping_address_name && (
                <div className="mb-2">
                  <div className="font-semibold">Shipping Address</div>
                  {customer.shipping_address_name.split('\n').map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              )}
              {customer?.billing_address_name && (
                <div>
                  <div className="font-semibold">Billing Address</div>
                  <div>{customer.billing_address_name}</div>
                  {customer.billing_city || customer.billing_state || customer.billing_zip ? (
                    <div>
                      {[customer.billing_city, customer.billing_state, customer.billing_zip].filter(Boolean).join(', ')}
                    </div>
                  ) : null}
                  {customer.billing_country && <div>{customer.billing_country}</div>}
                </div>
              )}
              {!customer?.shipping_address_name && !customer?.billing_address_name && (
                <div>We have no default address on file for this account.</div>
              )}
            </>
          }
          actionLabel={customer?.shipping_address_name || customer?.billing_address_name ? "Update Address" : "Create New Address"}
          onAction={(e) => {
            e.preventDefault();
            setShowAddressModal(true);
          }}
        />

        {/* Payment Card (Placeholder) */}
        <SettingsCard
          title="Payment"
          description="We have no default credit card on file for this account."
          actionLabel="Add a Credit Card"
        />
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <CreateAddressModal
          onClose={() => setShowAddressModal(false)}
          onAddressCreated={() => {
            setShowAddressModal(false);
            fetchCustomer();
          }}
          // Pass current address and mode
          address={customer?.shipping_address_name || customer?.billing_address_name ? {
            address1: customer?.shipping_addr1 || "",
            city: customer?.shipping_city || customer?.billing_city || "",
            state: customer?.shipping_state || customer?.billing_state || "",
            zip: customer?.shipping_zip || customer?.billing_zip || "",
            defaultBilling: !!customer?.billing_address_name,
            defaultShipping: !!customer?.shipping_address_name,
            // Add more fields as needed
          } : null}
          mode={customer?.shipping_address_name || customer?.billing_address_name ? "update" : "create"}
          customerId={customer?.id}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditModal && !customer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-xl relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-gray-800"
            >
              &times;
            </button>
            <ProfileEditCard onClose={() => setShowEditModal(false)} onCreate={handleCreateProfile} />
          </div>
        </div>
      )}
    </div>
  );
}
