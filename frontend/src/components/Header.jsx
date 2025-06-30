import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import AuthButton from "../common/AuthButton";

export default function Header() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isProductsHovered, setProductsHovered] = useState(false);

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
        <nav className="flex flex-col px-6 py-4 space-y-4 text-gray-800">
          <Link to="/" onClick={() => setDrawerOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setDrawerOpen(false)}>Products</Link>
          <Link
            to="/login"
            className="text-orange-600 font-semibold"
            onClick={() => setDrawerOpen(false)}
          >
            Login
          </Link>
        </nav>
      </div>

      {/* Backdrop overlay when drawer is open */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setDrawerOpen(false)}
        ></div>
      )}

      {/* Main Header */}
      <header className="bg-white shadow px-6 py-4 flex items-center justify-between relative z-30">
        {/* Left side: Hamburger + Logo + Nav */}
        <div className="flex items-center justify-start w-full lg:w-auto space-x-4">
          {/* Hamburger (visible only on mobile) */}
          <div className="lg:hidden">
            <FaBars
              className="text-2xl text-gray-700 cursor-pointer"
              onClick={() => setDrawerOpen(true)}
            />
          </div>

          {/* Centered Logo in mobile, left in desktop */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="Smiles First Logo" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Nav links for desktop only */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-sm text-gray-700 hover:text-orange-600">Home</Link>
            <div
              className="relative"
              onMouseEnter={() => setProductsHovered(true)}
              onMouseLeave={() => setProductsHovered(false)}
            >
              <span className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">Products</span>
              {isProductsHovered && (
                <div className="absolute left-0 top-full mt-2 w-[90vw] bg-white shadow-xl border rounded-md p-6 flex flex-wrap z-50 max-h-[80vh] overflow-y-auto">
                  {/* Your mega menu contents go here */}
                  <p>Category links...</p>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right: Auth & Cart (AuthButton hidden in mobile) */}
        <div className="flex items-center space-x-4">
          {/* Hide AuthButton in mobile, show only on lg+ */}
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
