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
import ProfileEditCard from "./components/ProfileEditCard"; // ✅ added edit page component
import ProtectedRoute from "./common/ProtectedRoute";

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
          <Route path="/products/by-class/:name" element={<ListProductsByClass />} />
          <Route path="/products/by-brand/:brandName" element={<ListProductsByBrand />} />
          <Route path="/products/by-name/:name" element={<ListProductsByName />} />
          <Route path="/promotions" element={<div>Promotions Page</div>} />
          <Route path="/clearance" element={<div>Clearance Page</div>} />
          <Route path="/partners" element={<div>Our Partners Page</div>} />
          <Route path="/about" element={<div>About Us Page</div>} />

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
