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
  ListProductPage,
} from "./pages";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PurchaseHistory from "./pages/PurchaseHistory";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/brands/d2-healthcare" element={<AllList />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/products/:name" element={<ListProductPage />} />
          <Route path="/profile/history" element={<PurchaseHistory />} />
          <Route path="/promotions" element={<div>Promotions Page</div>} />
          <Route path="/clearance" element={<div>Clearance Page</div>} />
          <Route path="/partners" element={<div>Our Partners Page</div>} />
          <Route path="/about" element={<div>About Us Page</div>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
export default App;
