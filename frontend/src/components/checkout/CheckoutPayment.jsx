
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "common";
import { AddressModal } from "common";

import AddressCard from "common/ui/AddressCard";
import useInitialAddress from "hooks/useInitialAddress";

export default function CheckoutPayment({ isAddModalOpen, setAddModalOpen }) {
  const userInfo = useSelector((state) => state.user.info);
  const navigate = useNavigate();

  const {
    addresses,
    setAddresses,
    selectedId,
    setSelectedId,
  } = useInitialAddress(userInfo);

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
      setSelectedId(addresses[0].id); // fallback to first
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

  return (
    <div className="space-y-6">
      {/* Address Section */}
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
      <AddressModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveAddress}
      />

    </div>
  );
}