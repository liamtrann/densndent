import React from "react";

export default function FilterSidebar() {
  return (
    <aside className="w-full lg:w-64 border-r pr-4">
      <h2 className="font-bold text-sm mb-4">Filter</h2>

      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-2">PRICE</h3>
        <div className="text-xs text-gray-600 mb-2">$119.99 — $2,629.99</div>
        <input type="range" min="119.99" max="2629.99" className="w-full" />
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-sm mb-2">CATEGORIES</h3>
        {["Dental", "Amalgam", "Alloys"].map((cat) => (
          <label key={cat} className="block text-sm">
            <input type="checkbox" className="mr-2" /> {cat}
          </label>
        ))}
      </div>

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
