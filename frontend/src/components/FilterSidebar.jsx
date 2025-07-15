import React, { useState } from "react";

export default function FilterSidebar() {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const predefinedRanges = [
    { label: "Under $100", min: 0, max: 100 },
    { label: "$100 - $300", min: 100, max: 300 },
    { label: "$300 - $500", min: 300, max: 500 },
    { label: "$500+", min: 500, max: Infinity },
  ];

  const handleRangeClick = (range) => {
    setMinPrice(range.min === 0 ? "" : range.min);
    setMaxPrice(range.max === Infinity ? "" : range.max);
  };

  return (
    <aside className="w-full lg:w-64 border-r pr-4">
      <h2 className="font-bold text-sm mb-4">Filter</h2>

      {/* PRICE FILTER */}
      <div className="mb-8">
        <h3 className="font-semibold text-sm mb-2">PRICE</h3>

        {/* Min/Max Inputs */}
        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border text-sm px-2 py-1 rounded"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border text-sm px-2 py-1 rounded"
          />
        </div>

        {/* Predefined Ranges */}
        <div className="flex flex-col space-y-2 text-sm">
          {predefinedRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => handleRangeClick(range)}
              className="text-blue-700 text-left hover:underline focus:outline-none"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* CATEGORY FILTER */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-2">CATEGORIES</h3>
        {["Dental", "Amalgam", "Alloys"].map((cat) => (
          <label key={cat} className="block text-sm">
            <input type="checkbox" className="mr-2" /> {cat}
          </label>
        ))}
      </div>

      {/* BRAND FILTER */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-2">BRAND</h3>
        {["Ivoclar", "SDI", "Silmet"].map((brand) => (
          <label key={brand} className="block text-sm">
            <input type="checkbox" className="mr-2" /> {brand}
          </label>
        ))}
      </div>
    </aside>
  );
}
