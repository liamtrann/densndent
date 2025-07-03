// components/profile/AddressModal.jsx
import React from "react";

export default function AddressModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          className="absolute top-2 right-4 text-xl font-bold text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Add New Address</h2>

        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Full Name *</label>
            <input type="text" className="w-full border p-2 rounded" required />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Address *</label>
            <input type="text" className="w-full border p-2 rounded" required placeholder="1234 Main Street" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Address 2</label>
            <input type="text" className="w-full border p-2 rounded" placeholder="Apt. 3 or Suite #1516" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">City *</label>
            <input type="text" className="w-full border p-2 rounded" required />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">State *</label>
            <select className="w-full border p-2 rounded" required>
              <option value="">-- Select --</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
              {/* Extend as needed */}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Zip Code *</label>
            <input type="text" className="w-full border p-2 rounded" required placeholder="94117" />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Phone Number *</label>
            <input type="text" className="w-full border p-2 rounded" required placeholder="555-123-1234" />
          </div>

          <div className="mb-4 space-y-2 text-sm">
            <label><input type="checkbox" className="mr-1" /> This is a Residential Address</label><br />
            <label><input type="checkbox" className="mr-1" /> Make this my default billing address</label><br />
            <label><input type="checkbox" className="mr-1" /> Make this my default shipping address</label>
          </div>

          <div className="flex justify-end gap-3">
            <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded">Save Address</button>
            <button type="button" onClick={onClose} className="bg-gray-700 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
