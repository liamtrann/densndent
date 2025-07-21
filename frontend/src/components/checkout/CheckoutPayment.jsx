import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, AddAddressModal } from "common";

export default function CheckoutPayment({ isAddModalOpen, setAddModalOpen }) {
  const userInfo = useSelector((state) => state.user.info);
  const navigate = useNavigate();

  // Multiple addresses (mocked from userInfo for now)
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // Load initial address if present in userInfo
  useEffect(() => {
    if (userInfo?.shipping_address_name) {
      const initialAddress = {
        id: Date.now(),
        fullName: `${userInfo.firstname} ${userInfo.lastname}`,
        address: userInfo.shipping_address_name.split("\n")[0] || "Unknown Address",
        city: userInfo.shipping_city,
        state: userInfo.shipping_state,
        zip: userInfo.shipping_zip,
        country: userInfo.shipping_country === "CA" ? "Canada" : userInfo.shipping_country,
        phone: userInfo.phone || "Phone not available",
        isDefaultShipping: true,
      };
      setAddresses([initialAddress]);
      setSelectedId(initialAddress.id);
    }
  }, [userInfo]);

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
      setSelectedId(addresses[0].id); // fallback to first address
    }
  };

  const handleSaveAddress = (newAddress) => {
    const id = Date.now();
    const formatted = {
      ...newAddress,
      id,
      isDefaultShipping: addresses.length === 0, // first address auto-selects
    };
    setAddresses((prev) => [...prev, formatted]);
    if (addresses.length === 0) {
      setSelectedId(id);
    }
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Address Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`border rounded shadow-sm p-4 bg-white ${
              addr.isDefaultShipping ? "ring-2 ring-green-500" : ""
            }`}
          >
            {addr.isDefaultShipping && (
              <div className="text-sm font-semibold text-green-700 mb-1">✓ Selected</div>
            )}
            <div className="space-y-1 text-sm">
              <div className="font-semibold">{addr.fullName}</div>
              <div>{addr.address}</div>
              <div>
                {[addr.city, addr.state, addr.zip].filter(Boolean).join(", ")}
              </div>
              <div>{addr.country}</div>
              <div className="text-blue-700">{addr.phone}</div>
            </div>
            <div className="flex gap-4 mt-2 text-sm text-blue-700 underline">
              <button onClick={() => handleSelectAddress(addr.id)}>Select</button>
              <button onClick={() => handleRemoveAddress(addr.id)}>Remove</button>
            </div>
          </div>
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
        <Button
          className="px-6 py-3"
          onClick={() => navigate("/checkout/review")}
          disabled={!selectedId}
        >
          Continue to Review
        </Button>
      </div>

      {/* Modal */}
      <AddAddressModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveAddress}
      />
    </div>
  );
}
