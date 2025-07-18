// src/App.js
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";

import { ProtectedRoute, ToastProvider } from "./common";
import { Header, Footer, ListProductPage, LayoutWithCart, ProfileEditCard, CenteredContent } from "./components";
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
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LayoutWithCart><CenteredContent><LandingPage /></CenteredContent></LayoutWithCart>} />
            {/* Routes WITH Cart Panel */}
            <Route path="/product/:id" element={
              <LayoutWithCart>
                <CenteredContent>
                  <ProductDetail />
                </CenteredContent>
              </LayoutWithCart>
            } />
            <Route path="/products/by-class/:nameAndId" element={
              <LayoutWithCart>
                <CenteredContent>
                  <ListProductPage by="class" />
                </CenteredContent>
              </LayoutWithCart>
            } />
            <Route path="/products/by-brand/:brandName" element={
              <LayoutWithCart>
                <CenteredContent>
                  <ListProductPage by="brand" />
                </CenteredContent>
              </LayoutWithCart>
            } />
            <Route path="/products/by-name/:name" element={
              <LayoutWithCart>
                <CenteredContent>
                  <ListProductPage by="name" />
                </CenteredContent>
              </LayoutWithCart>
            } />
            <Route path="/products/by-category/:categoryNameAndId" element={
              <LayoutWithCart>
                <CenteredContent>
                  <ListProductPage by="category" />
                </CenteredContent>
              </LayoutWithCart>
            } />

            {/* Routes WITHOUT Cart Panel */}
            <Route path="/cart" element={<CenteredContent><CartPage /></CenteredContent>} />
            <Route path="/faq" element={<CenteredContent><FAQPage /></CenteredContent>} />
            <Route path="/about" element={<CenteredContent><AboutUs /></CenteredContent>} />
            <Route path="/team" element={<CenteredContent><MeetOurTeam /></CenteredContent>} />
            <Route path="/contact" element={<CenteredContent><ContactPage /></CenteredContent>} />
            <Route path="/blog" element={<CenteredContent><BlogPage /></CenteredContent>} />
            <Route path="/promotions" element={<CenteredContent><PromotionsPage /></CenteredContent>} />
            <Route path="/promotions/jdiq" element={<CenteredContent><JdiqRaffleWinners /></CenteredContent>} />
            <Route path="/promotions/gift-card" element={<CenteredContent><GiftCardProgramPage /></CenteredContent>} />
            <Route path="/catalogues" element={<CenteredContent><CataloguesPage /></CenteredContent>} />
            <Route path="/clearance" element={<CenteredContent><ClearancePage /></CenteredContent>} />
            <Route path="/partners" element={<CenteredContent><OurPartners /></CenteredContent>} />
            <Route path="/promotions/q3-catalogue" element={<CenteredContent><Q3CataloguePage /></CenteredContent>} />

            <Route element={<ProtectedRoute />}>
              <Route path="/checkout/*" element={<CenteredContent><CheckoutPage /></CenteredContent>} />
              <Route path="/profile" element={<CenteredContent><ProfilePage /></CenteredContent>} />
              <Route path="/profile/edit" element={<CenteredContent><ProfileEditCard /></CenteredContent>} />
              <Route path="/profile/history" element={<CenteredContent><PurchaseHistory /></CenteredContent>} />
            </Route>

            <Route path="*" element={<CenteredContent><NotFound /></CenteredContent>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
