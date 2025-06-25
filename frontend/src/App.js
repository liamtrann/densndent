import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TopicalAnestheticPage from "./pages/TopicalAnestheticPage";
import CartPage from "./pages/CartPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product/topical-anesthetic" element={<TopicalAnestheticPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
