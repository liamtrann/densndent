import React from "react";

export default function ShopByCategories() {
  return (
    <>
      <section className="bg-blue-900 text-white text-center py-4">
        <h2 className="text-2xl font-bold">Shop By Categories</h2>
      </section>
      <section className="bg-white px-6 py-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 text-center">
        {[
          { name: "Anesthetics", img: "/anesthetics.png" },
          { name: "Cements & Liners", img: "/liners.png" },
          { name: "Gloves", img: "/gloves-icon.png" },
          { name: "Face Masks", img: "/masks.png" },
          { name: "Infection Control", img: "/wipes.png" },
          { name: "Instruments", img: "/instruments.png" },
          { name: "Restoratives", img: "/restoratives.png" },
        ].map(({ name, img }) => (
          <div key={name}>
            <img src={img} alt={name} className="mx-auto h-20 object-contain mb-2" />
            <p className="text-sm font-medium text-gray-800">{name}</p>
          </div>
        ))}
        <div className="flex justify-center items-center">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded">
            Shop All
          </button>
        </div>
      </section>
    </>
  );
}
