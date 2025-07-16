// components/checkout/CheckoutReview.jsx
import React from "react";
import { Button, Paragraph } from "common";

export default function CheckoutReview() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Review</h2>
      <Paragraph>Review summary placeholder</Paragraph>
      <div className="flex justify-end mt-6">
        <Button className="px-6 py-3">Place Order</Button>
      </div>
    </div>
  );
}
