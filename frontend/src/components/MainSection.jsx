import React from "react";
import Sidebar from "./Sidebar";
import HeroPromotion from "./HeroPromotion";
import PromotionGrid from "./PromotionGrid";



const promotions = [
  { img: "/june-flyer.png", label: "June Dental Flyer" },
  { img: "/10year-warranty.png", label: "10 Year Warranty" },
  { img: "/garrison.png", label: "Garrison Dental Solutions" },
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
