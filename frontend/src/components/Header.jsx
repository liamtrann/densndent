import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import AuthButton from "../common/AuthButton";

export default function Header() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isProductsHovered, setProductsHovered] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [expandedMobileMenus, setExpandedMobileMenus] = useState({});
  const hoverTimeout = useRef(null);

  const productCategories = [
    {
      name: "Alloys",
      subcategories: ["Amalgam"],
    },
    {
      name: "Anesthetics",
      subcategories: ["Injectables", "Needles", "Sutures", "Topical"],
    },
  ];

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout.current);
    setProductsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setProductsHovered(false);
      setHoveredCategory(null);
    }, 200);
  };

  const toggleMobileMenu = (category) => {
    setExpandedMobileMenus((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <>
      {/* Free Shipping Banner */}
      <div className="bg-blue-900 text-white text-sm text-center py-1">
        FREE SHIPPING on orders over $300
      </div>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b">
          <span className="text-lg font-bold">Menu</span>
          <FaTimes
            onClick={() => setDrawerOpen(false)}
            className="text-xl cursor-pointer"
          />
        </div>

        <nav className="flex flex-col px-6 py-4 space-y-2 text-gray-800 text-sm">
          <Link to="/" onClick={() => setDrawerOpen(false)}>Home</Link>

          {/* Expandable Products Section */}
          <div>
            <button
              onClick={() => toggleMobileMenu("Products")}
              className="flex items-center justify-between w-full py-2"
            >
              <span>Products</span>
              <span>{expandedMobileMenus["Products"] ? "▲" : "▼"}</span>
            </button>

            {expandedMobileMenus["Products"] && (
              <div className="ml-4 space-y-1">
                {productCategories.map((cat) => (
                  <div key={cat.name}>
                    <button
                      onClick={() => toggleMobileMenu(cat.name)}
                      className="flex justify-between w-full text-left"
                    >
                      <span>{cat.name}</span>
                      <span>{expandedMobileMenus[cat.name] ? "▲" : "▼"}</span>
                    </button>

                    {expandedMobileMenus[cat.name] && (
                      <div className="ml-4 text-gray-600">
                        {cat.subcategories.map((sub) => (
                          <div key={sub} className="py-1">
                            {sub}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link to="/login" onClick={() => setDrawerOpen(false)} className="text-orange-600 font-semibold">
            Login
          </Link>
        </nav>
      </div>

      {/* Backdrop overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}

      {/* Main Header */}
      <header className="bg-white shadow px-6 py-4 flex items-center justify-between relative z-30">
        {/* Left: Logo + Nav */}
        <div className="flex items-center justify-start w-full lg:w-auto space-x-4">
          {/* Hamburger for Mobile */}
          <div className="lg:hidden">
            <FaBars
              className="text-2xl text-gray-700 cursor-pointer"
              onClick={() => setDrawerOpen(true)}
            />
          </div>

          {/* Logo */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Smiles First Logo" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-sm text-gray-700 hover:text-orange-600">Home</Link>

            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">
                Products
              </span>

              {isProductsHovered && (
                <div className="absolute left-0 top-full mt-2 w-[600px] bg-white shadow-xl border rounded-md p-4 flex z-50">
                  {/* Left Column: Categories */}
                  <div className="w-1/2">
                    {productCategories.map((cat) => (
                      <div
                        key={cat.name}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                        onMouseEnter={() => setHoveredCategory(cat.name)}
                      >
                        <span className="text-sm">{cat.name}</span>
                        <span className="text-gray-400">&gt;</span>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Subcategories */}
                  <div className="w-1/2 border-l pl-4">
                    {hoveredCategory &&
                      productCategories
                        .find((cat) => cat.name === hoveredCategory)
                        ?.subcategories.map((sub) => (
                          <div
                            key={sub}
                            className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm"
                          >
                            {sub}
                          </div>
                        ))}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right: Auth + Cart */}
        <div className="flex items-center space-x-4">
          <div className="hidden lg:block">
            <AuthButton />
          </div>
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-xl text-orange-600 hover:text-orange-700" />
          </Link>
        </div>
      </header>
    </>
  );
}
