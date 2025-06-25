import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TopicalAnestheticPage from "./pages/TopicalAnestheticPage";
import CartPage from "./pages/CartPage"; // ✅ New: import the CartPage
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product/topical-anesthetic" element={<TopicalAnestheticPage />} />
        <Route path="/cart" element={<CartPage />} /> {/* ✅ New route for cart */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
