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
  CategoryTiles,
  Modal,
  BestSellersSection,
  CategoriesSection
} from "../components";
import HeroCarousel from "../components/HeroCarousel";


import { Image } from "../common";
import { URLS } from "../constants/urls";
import { Link } from "react-router-dom";

const brandKeys = [
  "d2", "3m", "aurelia", "dmg", "kerr",
  "keystone", "microcopy", "johnson-and-johnson", "dentsply",
  "diadent", "medicom", "premier", "surgical-specialties",
  "flight", "mark3"
];

const brands = brandKeys.map(key => ({
  key,
  url: URLS.BRANDS[key],
  name: key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}));

const LandingPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <MainSection />
      <HeroCarousel />
      <CategoryTiles />
      <PromotionsGrid />
      <Catalogues />
      <BestSellersSection />
      <BlueBanner
        title="Shop By Brands"
        items={brands}
        columns={{ base: 3, md: 4, lg: 6 }}
        renderItem={({ url, name, key }) => (
          <Link to={`/products/by-brand/${key}`}>
            <Image
              src={url}
              alt={name}
              className="h-12 object-contain hover:scale-105 transition-transform"
            />
          </Link>
        )}
      />

      <GlovesHighlight />

      {/* ✅ FAQs Preview + Learn More */}
      <FAQs />
      <MailingList />
    </div>
  );
};

export default LandingPage;
