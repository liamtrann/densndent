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

import { Image } from "../common";
import { URLS } from "../constants/urls";
import { Link } from "react-router-dom";

// Define brand keys
const brandKeys = [
  "d2-healthcare", "3m", "aurelia", "dmg", "kerr",
  "keystone", "microcopy", "johnson-and-johnson", "dentsply",
  "diadent", "medicom", "premier", "surgical-specialties",
  "flight", "mark3"
];

// Convert to full brand objects with URL and label
const brands = brandKeys.map(key => ({
  key,
  url: URLS.BRANDS[key],
  name: key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}));

// Final component
const LandingPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      <MainSection />
      <CategoryTiles />
      <PromotionsGrid />
      <Catalogues />
      <BestSellersSection />
      <CategoriesSection />

      {/* ✅ Shop By Brands with clickable logo */}
      <BlueBanner
        title="Shop By Brands"
        items={brands}
        columns={{ base: 3, md: 4, lg: 6 }}
        renderItem={({ url, name, key }) => (
          <Link to={`/brands/${key}`}>
            <Image
              src={url}
              alt={name}
              className="h-12 object-contain hover:scale-105 transition-transform"
            />
          </Link>
        )}
      />

      <GlovesHighlight />
      <FAQs />
      <MailingList />
    </div>
  );
};

export default LandingPage;
