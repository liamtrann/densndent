import React from "react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import MainSection from "../components/MainSection";
import ProductGrid from "../components/ProductGrid";
import CategoryTiles from "../components/CategoryTiles";
import Catalogues from "../components/Catalogues";
import BestSellers from "../components/BestSellers";
import GlovesHighlight from "../components/GlovesHighlight";
import ShopByCategories from "../components/ShopByCategories";
import ShopByBrands from "../components/ShopByBrands";
import FAQs from "../components/FAQs";
import MailingList from "../components/MailingList";
import Footer from "../components/Footer";

const LandingPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen font-sans">

            <Banner />
            <MainSection />
            <ProductGrid />
            <CategoryTiles />
            <Catalogues />
            <BestSellers />
            <GlovesHighlight />
            <ShopByCategories />
            <ShopByBrands />
            <FAQs />
            <MailingList />
        </div>
    );
};

export default LandingPage;
