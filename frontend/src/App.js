import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProductsPage from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import AllList from "./pages/AllList";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./pages/CheckoutPage";

// ✅ New import
import FAQPage from "./pages/FAQPage";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product/:id" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/brands/d2-healthcare" element={<AllList />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          {/* ✅ NEW FAQ ROUTE */}
          <Route path="/faq" element={<FAQPage />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
