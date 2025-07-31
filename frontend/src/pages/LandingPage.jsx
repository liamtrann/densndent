// src/pages/LandingPage.jsx
import React from "react";
import {
  Catalogues,
  FAQs,
  GlovesHighlight,
  MailingList,
  MainSection,
  PromotionsGrid,
  RecentlyViewedSection,
  CategoryTiles,
  BestSellersSection,
  ShopByBrand,
} from "components";
import { HeroCarousel } from "components";

const LandingPage = () => {
  return (
   <div className="bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-100 min-h-screen font-sans">

      <MainSection />
      <HeroCarousel />
      <div className="mt-12"></div>
      <RecentlyViewedSection /> 
      <CategoryTiles />
      {/* <PromotionsGrid /> */}
      <Catalogues buttonLink="/promotions/q3-catalogue" />
      <BestSellersSection />
      <ShopByBrand />
      <GlovesHighlight />
      <FAQs />
      <MailingList />
    </div>
  );
};

export default LandingPage;
