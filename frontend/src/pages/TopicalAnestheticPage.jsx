import React, { useState } from "react";
import { Button, Image, InputField } from '../common';

export default function TopicalAnestheticPage() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <Image
          src="/q2/topical-anesthetic.png"
          alt="Topical Anesthetic"
          className="w-full object-contain"
        />

        {/* Product Details */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            D2: Topical Anesthetic Gel 28gm Jar - D21301
          </h2>
          <p className="text-green-700 font-semibold">IN STOCK</p>
          <p className="text-2xl font-semibold mt-2">$11.99</p>
          <p className="text-sm text-gray-600 mt-1">BUY 3 GET 1 FREE</p>

          {/* Quantity Selector */}
          <div className="mt-4">
            <label className="block mb-1 font-medium">Quantity:</label>
            <InputField
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="px-2 py-1 w-24"
            />
          </div>

          {/* Buttons */}
          <Button variant="primary" className="mt-6 w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800">
            Add to Shopping Cart
          </Button>

          <div className="text-sm text-gray-500 mt-4">
            MPN: D21301 | SKU: TA-GEL
          </div>
        </div>
      </div>
    </div>
  );
}
