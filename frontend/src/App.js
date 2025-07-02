import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage, ProductsPage, CartPage, AllList, NotFound, CheckoutPage, FAQPage, ProfilePage } from "./pages";
import Header from "./components/Header";
import Footer from "./components/Footer";

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
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
