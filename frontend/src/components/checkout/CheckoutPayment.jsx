import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, AddAddressModal } from "common";
import { fetchUserInfo } from "../../redux/slices/userSlice";
import api from "api/api";
import endpoint from "api/endpoints";
import { useAuth0 } from "@auth0/auth0-react";

export default function CheckoutPayment({ isAddModalOpen, setAddModalOpen }) {
  const userInfo = useSelector((state) => state.user.info);
  const dispatch = useDispatch();
  const { getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();

  const handleRemoveAddress = async () => {
    if (!userInfo?.id) return;

    try {
      const token = await getAccessTokenSilently();
      await api.patch(
        endpoint.PATCH_UPDATE_CUSTOMER(userInfo.id),
        {
          addressBook: {
            items: [],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh the user info in Redux
      dispatch(fetchUserInfo({ user, getAccessTokenSilently }));
    } catch (error) {
      console.error("❌ Error removing address:", error);
      alert("Failed to remove address. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Address Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userInfo?.shipping_address_name || userInfo?.shipping_addr1 ? (
          <div className="border rounded shadow-sm p-4 bg-white">
            <div className="text-sm font-semibold text-green-700 mb-1">✓ Selected</div>
            <div className="space-y-1 text-sm">
              <div className="font-semibold">
                {userInfo?.firstname} {userInfo?.lastname}
              </div>

              {/* Address block */}
              {userInfo?.shipping_address_name ? (
                <>
                  {userInfo.shipping_address_name
                    .split("\n")
                    .filter(Boolean)
                    .map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}

                  {(!userInfo.shipping_address_name.includes(userInfo.shipping_city) ||
                    !userInfo.shipping_address_name.includes(userInfo.shipping_zip)) && (
                    <div>
                      {[userInfo.shipping_city, userInfo.shipping_state, userInfo.shipping_zip]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                  {userInfo.shipping_country && (
                    <div>
                      {userInfo.shipping_country === "CA"
                        ? "Canada"
                        : userInfo.shipping_country}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>{userInfo?.shipping_addr1 || "No address on file"}</div>
                  <div>
                    {[userInfo?.shipping_city, userInfo?.shipping_state, userInfo?.shipping_zip]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                  <div>{userInfo?.shipping_country || "Canada"}</div>
                </>
              )}

              <div className="text-blue-700">
                {userInfo?.phone ||
                  userInfo?.shipping_phone ||
                  userInfo?.billing_phone ||
                  "Phone not available"}
              </div>
            </div>

            {/* Edit/Remove Buttons */}
            <div className="flex gap-4 mt-2 text-sm text-blue-700 underline">
              <button type="button" onClick={() => setAddModalOpen(true)}>
                Edit
              </button>
              <button type="button" onClick={handleRemoveAddress}>
                Remove
              </button>
            </div>
          </div>
        ) : (
          // If no address is present
          <div className="border rounded shadow-sm p-4 flex items-center justify-center bg-gray-50 text-gray-500">
            No address saved. Please add one.
          </div>
        )}

        {/* Add Address Option */}
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

      {/* Delivery Method */}
      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="font-semibold mb-2">Delivery Method</h3>
        <label className="flex items-center border p-3 rounded cursor-pointer hover:border-orange-400 transition">
          <input type="radio" name="delivery" defaultChecked className="mr-3" />
          <div className="text-sm">
            <div>ICS Ground – Online</div>
            <div className="text-gray-500 text-xs">$9.99</div>
          </div>
        </label>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button className="px-6 py-3" onClick={() => navigate("/checkout/review")}>
          Continue to Review
        </Button>
      </div>

      {/* Address Modal */}
      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={() => setAddModalOpen(false)}
      />
    </div>
  );
}
