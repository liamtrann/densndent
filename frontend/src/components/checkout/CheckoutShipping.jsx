// components/checkout/CheckoutShipping.jsx
import React from "react";
import { InputField, Button, Dropdown } from "common";
import { useNavigate } from "react-router-dom";

export default function CheckoutShipping({ isResidential, setIsResidential }) {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Choose Shipping Address</h2>
      <div className="bg-white p-6 rounded shadow-md space-y-4">
        <InputField label="Full Name" placeholder="Huzaifa Khan" />
        <InputField label="Address" placeholder="1234 Main Street" />
        <InputField placeholder="(optional)" />
        <InputField label="City *" />
        <Dropdown
          label="State *"
          options={[
            { key: "ny", value: "NY", label: "New York" },
            { key: "ca", value: "CA", label: "California" },
            { key: "tx", value: "TX", label: "Texas" },
          ]}
        />
        <InputField label="Zip Code *" placeholder="94117" />
        <InputField label="Phone Number *" placeholder="555-123-1234" />
        <InputField
          type="checkbox"
          checked={isResidential}
          onChange={(e) => setIsResidential(e.target.checked)}
          label="This is a Residential Address"
        />
      </div>
      <div className="flex justify-end mt-6">
        <Button
          className="px-6 py-3"
          onClick={() => navigate("/checkout/payment")}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
