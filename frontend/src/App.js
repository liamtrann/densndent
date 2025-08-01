// src/App.js
import { useAuth0 } from "@auth0/auth0-react";
import React, { Suspense, lazy } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { fetchUserInfo, clearUserInfo } from "store/slices/userSlice";

import { ProtectedRoute, ToastProvider, Loading } from "./common";
import { Header, Footer, LayoutWithCart, CenteredContent } from "./components";
import { LandingPage } from "./pages";
// Lazy loaded components
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const ListProductPage = lazy(() => import("./components/product/ListProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ProfileEditCard = lazy(() => import("./components/profile/ProfileEditCard"));
const PurchaseHistory = lazy(() => import("./pages/PurchaseHistory"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const MeetOurTeam = lazy(() => import("./pages/MeetOurTeam"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const JdiqRaffleWinners = lazy(() => import("./pages/JdiqRaffleWinners"));
const GiftCardProgramPage = lazy(() => import("./pages/GiftCardProgramPage"));
const OurPartners = lazy(() => import("./pages/OurPartners"));
const Q3CataloguePage = lazy(() => import("./pages/Q3CataloguePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Simple placeholder components
const BlogPage = lazy(() => import("./pages/BlogPage"));

const PromotionsPage = lazy(() => Promise.resolve({ default: () => <div>Promotions Page</div> }));
const CataloguesPage = lazy(() => Promise.resolve({ default: () => <div>Catalogues Page</div> }));
const ClearancePage = lazy(() => import("./pages/ClearancePage"));


// Loading fallback component
const PageLoading = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <Loading text="Loading page..." />
  </div>
);

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
          <Suspense fallback={<PageLoading />}>
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
              <Route path="/clearance" element={<ClearancePage />} />


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
          </Suspense>
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
