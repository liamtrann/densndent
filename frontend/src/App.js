// src/App.js
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";



import { ProtectedRoute } from "./common";
import { Header, Footer, ListProductPage, LayoutWithCart, ProfileEditCard } from "./components";
import {
  LandingPage,
  ProductDetail,
  CartPage,
  NotFound,
  CheckoutPage,
  FAQPage,
  ProfilePage,
} from "./pages";
import AboutUs from "./pages/AboutUs";
import ContactPage from "./pages/ContactPage";
import GiftCardProgramPage from "./pages/GiftCardProgramPage";
import JdiqRaffleWinners from "./pages/JdiqRaffleWinners";
import MeetOurTeam from "./pages/MeetOurTeam";
import OurPartners from "./pages/OurPartners";
import PurchaseHistory from "./pages/PurchaseHistory";
import Q3CataloguePage from "./pages/Q3CataloguePage";
import { fetchUserInfo, clearUserInfo } from "./redux/slices/userSlice";

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
          <Route path="/" element={<LayoutWithCart><LandingPage /></LayoutWithCart>} />

          {/* Routes WITH Cart Panel */}
          <Route path="/product/:id" element={
            <LayoutWithCart>
              <ProductDetail />
            </LayoutWithCart>
          } />
          <Route path="/products/by-class/:nameAndId" element={
            <LayoutWithCart>
              <ListProductPage by="class" />
            </LayoutWithCart>
          } />
          <Route path="/products/by-brand/:brandName" element={
            <LayoutWithCart>
              <ListProductPage by="brand" />
            </LayoutWithCart>
          } />
          <Route path="/products/by-name/:name" element={
            <LayoutWithCart>
              <ListProductPage by="name" />
            </LayoutWithCart>
          } />
          <Route path="/products/by-category/:categoryNameAndId" element={
            <LayoutWithCart>
              <ListProductPage by="category" />
            </LayoutWithCart>
          } />

          {/* Routes WITHOUT Cart Panel */}
          <Route path="/cart" element={<CartPage />} />
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
          <Route path="/promotions/q3-catalogue" element={<Q3CataloguePage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/checkout/*" element={<CheckoutPage />} />
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
