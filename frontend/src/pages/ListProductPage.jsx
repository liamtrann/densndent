import React from "react";
import ListProduct from "../components/ListProduct"; // Path must match the real file location


const sampleProducts = [
  {
    id: 1,
    name: "Silmet: Spherodon M 50 Capsules Regular Set 2 Spill - 121472",
    img: "/amalgam-1.jpg",
    price: "119.99",
  },
  {
    id: 2,
    name: "Silmet: Spherodon M 50 Capsules Regular Set 1 Spill - 121471",
    img: "/amalgam-2.jpg",
    price: "119.99",
  },
  {
    id: 3,
    name: "Silmet: Spherodon M - 50 Capsules Fast Set 1 Spill - 120471",
    img: "/amalgam-3.jpg",
    price: "119.99",
  },
  {
    id: 4,
    name: "Silmet: Spherodon M (Silmet) - 50 Capsules Fast Set 3 Spill - 120473",
    img: "/amalgam-4.jpg",
    price: "119.99",
  },
];

export default function ListProductPage() {
  return (
    <div className="px-6 py-8 max-w-screen-xl mx-auto">
      {/* Breadcrumb & Heading */}
      <div className="text-sm text-gray-600 mb-4">
        Home - Products - Alloys - <span className="font-semibold">Amalgam</span>
      </div>
      <h1 className="text-3xl font-bold text-smiles-blue mb-6">AMALGAM</h1>

      {/* Layout: Sidebar + Main */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
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

        {/* Main Product Grid */}
        <main className="flex-1">
          {/* Controls: Show & Sort */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="text-sm font-medium tracking-wide">29 PRODUCTS</div>
            <div className="flex items-center space-x-4">
              <div>
                Show:{" "}
                <select className="border px-2 py-1 text-sm">
                  <option>48 per page</option>
                </select>
              </div>
              <div>
                Sort by:{" "}
                <select className="border px-2 py-1 text-sm">
                  <option>Price, low to high</option>
                  <option>Price, high to low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid of Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sampleProducts.map((product) => (
              <ListProduct key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
