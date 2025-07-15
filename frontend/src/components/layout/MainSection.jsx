import React from "react";
import Sidebar from "../sections/Sidebar";
import HeroPromotion from "../promotions/HeroPromotion";
import PromotionGrid from "../promotions/PromotionGrid";



const promotions = [
];

export default function MainSection() {
  return (
    <main className="p-6 grid grid-cols-12 gap-6">
 
      <section className="col-span-9 space-y-6">
        <HeroPromotion
        />
        <PromotionGrid promotions={promotions} />
      </section>
    </main>
  );
}
