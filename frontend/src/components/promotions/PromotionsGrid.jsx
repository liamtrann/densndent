// src/components/PromotionsGrid.jsx
import React from "react";
import { PromotionCard } from "common";

const promotions = [
  {
    image: "/q2/topical-anesthetic.png",
    alt: "Topical Anesthetic",
    brand: "Our House Brand",
    title: "TOPICAL ANESTHETIC",
    offer: "BUY 3 GET 1 FREE",
    price: "$8.99",
    oldPrice: "$11.99",
    link: "/product/topical-anesthetic",
  },
  // Add more promotions here as needed
];

export default function PromotionsGrid() {
  return (
    <section className="mt-10 px-6">
      <h2 className="text-2xl font-bold text-smiles-blue mb-6">
        Q2 Promotions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {promotions.map((promo, idx) => (
          <PromotionCard key={promo.title + idx} {...promo} />
        ))}
      </div>
    </section>
  );
}
