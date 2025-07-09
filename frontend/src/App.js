// src/App.js
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
  ListProductsByClass,
  ListProductsByBrand,
  ListProductsByName
} from "./pages";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PurchaseHistory from "./pages/PurchaseHistory";
import ProfileEditCard from "./components/ProfileEditCard"; // ✅ profile edit modal
import ProtectedRoute from "./common/ProtectedRoute";
import AboutUs from './pages/AboutUs'; // at top

// Placeholder fallback pages for new links
const AboutUsPage = () => <div>About Us Page</div>;
const TeamPage = () => <div>Meet Our Team Page</div>;
const ContactPage = () => <div>Contact Us Page</div>;
const BlogPage = () => <div>Blog Page</div>;
const PromotionsPage = () => <div>Promotions Page</div>;
const CataloguesPage = () => <div>Catalogues Page</div>;
const ClearancePage = () => <div>Clearance Page</div>;
const PartnersPage = () => <div>Our Partners Page</div>;

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/catalogues" element={<CataloguesPage />} />
          <Route path="/clearance" element={<ClearancePage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/products/by-class/:name" element={<ListProductsByClass />} />
          <Route path="/products/by-brand/:brandName" element={<ListProductsByBrand />} />
          <Route path="/products/by-name/:name" element={<ListProductsByName />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditCard />} />
            <Route path="/profile/history" element={<PurchaseHistory />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
