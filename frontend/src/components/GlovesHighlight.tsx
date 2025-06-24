import React from "react";

export default function GlovesHighlight() {
  return (
    <section className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 py-12 bg-orange-50">
      <div className="max-w-md">
        <h2 className="text-3xl font-bold text-blue-900 mb-3">Gloves</h2>
        <p className="text-gray-700 mb-4">
          Ensure safety and comfort with high-quality dental gloves — essential supplies in every clinic’s inventory.
        </p>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded">
          Shop Now
        </button>
      </div>
      <img src="/gloves-banner.png" alt="Gloves" className="w-full md:w-1/2 rounded-lg" />
    </section>
  );
}
