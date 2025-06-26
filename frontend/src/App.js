import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import AllList from "./pages/AllList"; // ✅ Correct placement
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product/topical-anesthetic" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/brands/d2-healthcare" element={<AllList />} /> {/* ✅ Moved inside Routes */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
