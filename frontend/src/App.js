import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import TopicalAnestheticPage from "./pages/TopicalAnestheticPage"; // 👈 Import it
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product/topical-anesthetic" element={<TopicalAnestheticPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
