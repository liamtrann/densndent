import React from "react";

export default function ShopByBrands() {
  return (
    <>
      <section className="bg-blue-900 text-white text-center py-4">
        <h2 className="text-2xl font-bold">Shop By Brands</h2>
      </section>
      <section className="bg-white px-6 py-8 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center">
        {[
          "d2-healthcare.png", "3m.png", "ansell.png", "aurelia.png",
          "flow.png", "mark3.png", "surgical-specialties.png", "medicom.png",
          "dia-dent.png", "dmg.png", "keystone.png", "kerr.png",
          "morita.png", "pulpdent.png"
        ].map((src) => (
          <img key={src} src={`/brands/${src}`} alt={src.split('.')[0]} className="h-12 object-contain" />
        ))}
        <div className="col-span-full flex justify-center mt-4">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded">
            Shop All
          </button>
        </div>
      </section>
    </>
  );
}
