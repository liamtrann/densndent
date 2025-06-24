import React from "react";

export default function MainSection() {
  return (
    <main className="p-6 grid grid-cols-12 gap-6">
      {/* Sidebar */}
      <aside className="col-span-3 bg-white rounded-xl shadow-md p-5 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Quick Order</h2>
        <div className="flex gap-2">
          <input placeholder="Item Code" className="border rounded px-2 py-1 w-full" />
          <input placeholder="Qty" className="border rounded px-2 py-1 w-1/3" />
          <button className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700">Add</button>
        </div>
        <nav className="space-y-2 text-blue-700 text-sm">
          {[
            "Order from History", "Browse Supplies", "Speed Entry", "Sales & Promotions",
            "Shopping Lists", "My Order", "Unplaced Orders", "Catalogues & Flyers",
            "Dens 'n Dente Brands", "Featured Brands", "SDS Look-up"
          ].map((item) => (
            <li key={item} className="hover:underline cursor-pointer">{item}</li>
          ))}
        </nav>
      </aside>

      {/* Hero + Promotions */}
      <section className="col-span-9 space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-orange-800 mb-2">Fluorides, Toothbrushes & Floss</h1>
            <p className="text-lg text-orange-600">Up to 35% Off</p>
            <p className="text-gray-600 mb-3">+ Exclusive Special Offers</p>
            <button className="bg-orange-600 text-white px-5 py-2 rounded hover:bg-orange-700">Shop Now</button>
            <p className="text-xs text-gray-500 mt-1">Promo Code: WA | Expires June 30</p>
          </div>
          <img src="/products-banner.png" alt="Hero Banner" className="h-44 object-contain" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { img: "/june-flyer.png", label: "June Dental Flyer" },
            { img: "/10year-warranty.png", label: "10 Year Warranty" },
            { img: "/garrison.png", label: "Garrison Dental Solutions" },
          ].map(({ img, label }) => (
            <div key={label} className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition">
              <img src={img} alt={label} className="w-full h-40 object-cover rounded" />
              <p className="text-center font-medium mt-2">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
