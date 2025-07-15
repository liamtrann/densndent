import React from "react";
import { PromotionCard } from "../../common";

export default function PromotionGrid({ promotions }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {promotions.map(({ img, label }) => (
        <PromotionCard key={label} img={img} label={label} />
      ))}
    </div>
  );
}
