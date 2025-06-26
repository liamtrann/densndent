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
import BestSellersSection from "../components/BestSellersSection";
import CategoriesSection from "../components/CategoriesSection";

import { Image, BestSellerCard } from "../common";
import { URLS } from "../constants/urls";

const bestSellers = [
  { name: "SPONGOSTAN", brand: "Johnson & Johnson", img: "/spongostan.png" },
  { name: "LIDOCAINE", brand: "Cook-Waite", img: "/lidocaine.png" },
  { name: "XYLOCAINE", brand: "Dentsply Sirona", img: "/xylocaine.png" },
  { name: "STEAM INDICATOR", brand: "Bionova", img: "/steam-indicator.png" },
  { name: "CAVITRON", brand: "Dentsply Sirona", img: "/cavitron.png" },
  { name: "BITE REGISTRATION", brand: "Mark3", img: "/bite-registration.png" },
];

const categories = [
  { name: "Anesthetics", img: "/anesthetics.png" },
  { name: "Cements & Liners", img: "/liners.png" },
  { name: "Gloves", img: "/gloves-icon.png" },
  { name: "Face Masks", img: "/masks.png" },
  { name: "Infection Control", img: "/wipes.png" },
  { name: "Instruments", img: "/instruments.png" },
  { name: "Restoratives", img: "/restoratives.png" },
];

const brands = [
  "d2-healthcare.png", "3m.png", "aurelia.png", "dmg.png", "kerr.png",
  "keystone.png", "microcopy.png", "johnson-and-johnson.png", "dentsply.png",
  "diadent.png", "medicom.png", "premier.png", "surgical-specialties.png",
  "flight.png", "mark3.png" // ✅ Added here
];

const LandingPage = () => {

  const blueBannerConfigs = [
    {
      title: "Best Sellers",
      items: bestSellers,
      columns: { base: 2, md: 4, lg: 6 },
      renderItem: (item) => <BestSellerCard {...item} />,
      showButton: false
    },
    {
      title: "Shop By Categories",
      items: categories,
      columns: { base: 2, md: 4, lg: 5 },
      renderItem: ({ name, img }) => (
        <>
          <Image src={img} alt={name} className="mx-auto h-20 object-contain mb-2" />
          <p className="text-sm font-medium text-gray-800">{name}</p>
        </>
      )
    },
    {
      title: "Shop By Brands",
      items: brands,
      columns: { base: 3, md: 4, lg: 6 },
      renderItem: (src) => {
        const key = src.split(".")[0].toLowerCase().replace(/\s+/g, "-");
        const brandImage = URLS.BRANDS[key] || `/brands/${src}`;
        return (
          <img
            src={brandImage}
            alt={key}
            className="h-12 object-contain mx-auto"
          />
        );
      }
    }
  ];
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
      {blueBannerConfigs.map((config) => (
        <BlueBanner key={config.title} {...config} />
      ))}
      <GlovesHighlight />
      <FAQs />
      <MailingList />
    </div>
  );
}
export default LandingPage;
