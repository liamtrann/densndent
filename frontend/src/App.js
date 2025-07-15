// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  LandingPage,
  ProductDetail,
  CartPage,
  AllList,
  NotFound,
  CheckoutPage,
  FAQPage,
  ProfilePage,
} from "./pages";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { ListProductPage } from "./components";
import PurchaseHistory from "./pages/PurchaseHistory";
import ProfileEditCard from "./components/ProfileEditCard";
import ProtectedRoute from "./common/ProtectedRoute";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { fetchUserInfo, clearUserInfo } from "./redux/slices/userSlice";

import AboutUs from "./pages/AboutUs";
import ContactPage from "./pages/ContactPage";
import MeetOurTeam from "./pages/MeetOurTeam";
import OurPartners from "./pages/OurPartners";
import JdiqRaffleWinners from "./pages/JdiqRaffleWinners";
import GiftCardProgramPage from "./pages/GiftCardProgramPage";

const BlogPage = () => <div>Blog Page</div>;
const PromotionsPage = () => <div>Promotions Page</div>;
const CataloguesPage = () => <div>Catalogues Page</div>;
const ClearancePage = () => <div>Clearance Page</div>;

export default function App() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserInfo({ user, getAccessTokenSilently }));
    } else {
      dispatch(clearUserInfo());
    }
  }, [isAuthenticated, user, getAccessTokenSilently, dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout/*" element={<CheckoutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/team" element={<MeetOurTeam />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/promotions/jdiq" element={<JdiqRaffleWinners />} />
          <Route path="/promotions/gift-card" element={<GiftCardProgramPage />} />
          <Route path="/catalogues" element={<CataloguesPage />} />
          <Route path="/clearance" element={<ClearancePage />} />
          <Route path="/partners" element={<OurPartners />} />
          <Route path="/products/by-class/:nameAndId" element={<ListProductPage by="class" />} />
          <Route path="/products/by-brand/:brandName" element={<ListProductPage by="brand" />} />
          <Route path="/products/by-name/:name" element={<ListProductPage by="name" />} />
          <Route path="/products/by-category/:categoryNameAndId" element={<ListProductPage by="category" />} />
          <Route path="/products/by-order-history/:userId" element={<ListProductPage by="orderHistory" />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditCard />} />
            <Route path="/profile/history" element={<PurchaseHistory />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
