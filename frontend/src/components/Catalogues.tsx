import React from "react";

export default function Catalogues() {
  return (
    <section className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 py-12 bg-white">
      <div className="max-w-md">
        <h2 className="text-3xl font-bold text-orange-900 mb-3">Catalogues</h2>
        <p className="text-gray-700 mb-4">
          Browse our catalogues for exclusive discounts on dental supplies, instruments, equipment, and disposables.
        </p>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded">
          Shop Now
        </button>
      </div>
      <img src="/catalogue-banner.png" alt="Catalogues" className="w-full md:w-1/2 rounded-lg" />
    </section>
  );
}
