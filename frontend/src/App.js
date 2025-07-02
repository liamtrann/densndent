import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProductsPage from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import AllList from "./pages/AllList"; // ✅ Correct placement
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/product/:id" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/brands/d2-healthcare" element={<AllList />} /> {/* ✅ Moved inside Routes */}
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
