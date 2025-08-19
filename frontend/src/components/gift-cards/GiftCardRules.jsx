import React from "react";

export default function GiftCardRules() {
  return (
    <div className="mt-12">
      <div className="bg-smiles-blue text-white font-semibold py-3 px-6 rounded-lg mb-6 text-center text-md">
        Need assistance? Give us a call — we’re here and happy to help!
      </div>

      <h3 className="text-md font-bold text-smiles-blue mb-4 uppercase">
        Gift Card Rules & Qualification Requirements:
      </h3>
      <ol className="list-decimal ml-6 text-gray-800 space-y-2 text-sm mb-6">
        <li>
          Applies only to call-in orders. Website orders are not eligible.
        </li>
        <li>Only valid for regular-priced products and vendor promotions.</li>
        <li>Excludes custom or special-order items.</li>
        <li>Not valid on large or mid-sized equipment.</li>
        <li>Cannot be combined with any past/future orders.</li>
        <li>Must be paid entirely by credit card.</li>
      </ol>

      <p className="text-sm text-gray-700 mb-2">
        If an order is canceled or returned, the gift card value will be
        adjusted or deducted from the refund.
      </p>
      <p className="text-sm text-gray-700">
        The Gift Card Program and its policies may change without prior notice.
      </p>
    </div>
  );
}
