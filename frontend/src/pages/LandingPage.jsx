import React from "react";
import {
  Banner,
  Catalogues,
  FAQs,
  GlovesHighlight,
  MailingList,
  MainSection,
  PromotionsGrid,
  BlueBanner,
  CategoryTiles
} from "../components";
import { Image } from '../common';
import BestSellersSection from "../components/BestSellersSection";
import CategoriesSection from "../components/CategoriesSection";

const brands = [
  "d2-healthcare.png", "3m.png", "ansell.png", "aurelia.png",
  "flow.png", "mark3.png", "surgical-specialties.png", "medicom.png",
  "dia-dent.png", "dmg.png", "keystone.png", "kerr.png",
  "morita.png", "pulpdent.png"
];

const LandingPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Banner text="FREE SHIPPING on orders over $300" />
      <MainSection />
      <CategoryTiles />
      <PromotionsGrid />
      <Catalogues />
      <BestSellersSection />
      <CategoriesSection />
      <BlueBanner
        title="Shop By Brands"
        items={brands}
        columns={{ base: 3, md: 4, lg: 6 }}
        renderItem={(src) => (
          <Image src={`/brands/${src}`} alt={src.split('.')[0]} className="h-12 object-contain" />
        )}
      />
      <GlovesHighlight />
      <FAQs />
      <MailingList />
    </div>
  );
};

export default LandingPage;
