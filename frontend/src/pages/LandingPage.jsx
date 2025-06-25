import React from "react";
import Banner from "../components/Banner";
import Catalogues from "../components/Catalogues";
import CategoryTiles from "../components/CategoryTiles";
import FAQs from "../components/FAQs";
import Footer from "../components/Footer";
import GlovesHighlight from "../components/GlovesHighlight";
import Header from "../components/Header";
import MailingList from "../components/MailingList";
import MainSection from "../components/MainSection";
import PromotionsGrid from "../components/PromotionsGrid";
import ProductGrid from "../components/ProductGrid";
import BlueBanner from "../components/BlueBanner";
import { Image } from '../common';

const LandingPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">

      <Banner />
      <MainSection />
      <CategoryTiles />
      <PromotionsGrid />

      <Catalogues />
      
      {/* Best Sellers */}
      <BlueBanner
        title="Best Sellers"
        items={[
          { name: "SPONGOSTAN", brand: "Johnson & Johnson", img: "/spongostan.png" },
          { name: "LIDOCAINE", brand: "Cook-Waite", img: "/lidocaine.png" },
          { name: "XYLOCAINE", brand: "Dentsply Sirona", img: "/xylocaine.png" },
          { name: "STEAM INDICATOR", brand: "Bionova", img: "/steam-indicator.png" },
          { name: "CAVITRON", brand: "Dentsply Sirona", img: "/cavitron.png" },
          { name: "BITE REGISTRATION", brand: "Mark3", img: "/bite-registration.png" },
        ]}
        columns={{ base: 2, md: 4, lg: 6 }}
        renderItem={({ name, brand, img }) => (
          <div className="shadow-md rounded-lg p-3 bg-white">
            <Image src={img} alt={name} className="mx-auto h-24 object-contain mb-2" />
            <p className="text-xs text-gray-600">{brand}</p>
            <h3 className="font-bold text-sm">{name}</h3>
          </div>
        )}
        showButton={false}
      />

      {/* Shop By Categories */}
      <BlueBanner
        title="Shop By Categories"
        items={[
          { name: "Anesthetics", img: "/anesthetics.png" },
          { name: "Cements & Liners", img: "/liners.png" },
          { name: "Gloves", img: "/gloves-icon.png" },
          { name: "Face Masks", img: "/masks.png" },
          { name: "Infection Control", img: "/wipes.png" },
          { name: "Instruments", img: "/instruments.png" },
          { name: "Restoratives", img: "/restoratives.png" },
        ]}
        columns={{ base: 2, md: 4, lg: 5 }}
        renderItem={({ name, img }) => (
          <>
            <Image src={img} alt={name} className="mx-auto h-20 object-contain mb-2" />
            <p className="text-sm font-medium text-gray-800">{name}</p>
          </>
        )}
      />

      {/* Shop By Brands */}
      <BlueBanner
        title="Shop By Brands"
        items={[
          "d2-healthcare.png", "3m.png", "ansell.png", "aurelia.png",
          "flow.png", "mark3.png", "surgical-specialties.png", "medicom.png",
          "dia-dent.png", "dmg.png", "keystone.png", "kerr.png",
          "morita.png", "pulpdent.png"
        ]}
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
