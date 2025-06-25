import React from "react";
import Sidebar from "./Sidebar";
import HeroPromotion from "./HeroPromotion";
import PromotionGrid from "./PromotionGrid";

const navItems = [
  "Order from History", "Browse Supplies", "Speed Entry", "Sales & Promotions",
  "Shopping Lists", "My Order", "Unplaced Orders", "Catalogues & Flyers",
  "Dens 'n Dente Brands", "Featured Brands", "SDS Look-up"
];

const promotions = [
  { img: "/june-flyer.png", label: "June Dental Flyer" },
  { img: "/10year-warranty.png", label: "10 Year Warranty" },
  { img: "/garrison.png", label: "Garrison Dental Solutions" },
];

export default function MainSection() {
  return (
    <main className="p-6 grid grid-cols-12 gap-6">
      <Sidebar title="Quick Order" navItems={navItems} />
      <section className="col-span-9 space-y-6">
        <HeroPromotion
          title="Fluorides, Toothbrushes & Floss"
          offer="Up to 35% Off"
          description="+ Exclusive Special Offers"
          buttonText="Shop Now"
          promoCode="Promo Code: WA | Expires June 30"
          imageSrc="/products-banner.png"
          imageAlt="Hero Banner"
        />
        <PromotionGrid promotions={promotions} />
      </section>
    </main>
  );
}
