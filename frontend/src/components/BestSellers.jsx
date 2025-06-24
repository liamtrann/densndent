import React from "react";

export default function BestSellers() {
  return (
    <>
      <section className="bg-blue-900 text-white text-center py-4">
        <h2 className="text-2xl font-bold">Best Sellers</h2>
      </section>
      <section className="bg-white px-6 py-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
        {[
          { name: "SPONGOSTAN", brand: "Johnson & Johnson", img: "/spongostan.png" },
          { name: "LIDOCAINE", brand: "Cook-Waite", img: "/lidocaine.png" },
          { name: "XYLOCAINE", brand: "Dentsply Sirona", img: "/xylocaine.png" },
          { name: "STEAM INDICATOR", brand: "Bionova", img: "/steam-indicator.png" },
          { name: "CAVITRON", brand: "Dentsply Sirona", img: "/cavitron.png" },
          { name: "BITE REGISTRATION", brand: "Mark3", img: "/bite-registration.png" },
        ].map(({ name, brand, img }) => (
          <div key={name} className="shadow-md rounded-lg p-3 bg-white">
            <img src={img} alt={name} className="mx-auto h-24 object-contain mb-2" />
            <p className="text-xs text-gray-600">{brand}</p>
            <h3 className="font-bold text-sm">{name}</h3>
          </div>
        ))}
      </section>
    </>
  );
}
