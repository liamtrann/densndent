// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { FaBars, FaSearch } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import Logo from './Logo';
import MobileDrawer from './MobileDrawer';
import DesktopNav from './DesktopNav';
import CartIndicator from "./CartIndicator";
import AuthButton from "../common/AuthButton";
import SearchBar from "../components/SearchBar";
import { fetchClassifications } from "../redux/slices/classificationSlice";
import { delayCall } from "../api/util";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const cartItems = useSelector(s => s.cart.items);
  const total = cartItems.length;

  const dispatch = useDispatch();
  const { classes: categories = [] } = useSelector(s => s.classification || {});

  useEffect(() => {
    if (!categories.length) delayCall(() => dispatch(fetchClassifications()));
  }, [dispatch, categories.length]);

  const navCategories = categories
    .filter(cat => Array.isArray(cat.child) && cat.child.length > 0)
    .map(cat => ({
      name: cat.name,
      id: cat.id,
      subcategories: cat.child.map(sub => ({ name: sub.name, id: sub.id }))
    }));

  const toggleMenu = key =>
    setExpandedMenus(m => ({ ...m, [key]: !m[key] }));

  return (
    <>
      {/* Free Shipping Banner */}
      <div className="bg-blue-900 text-white text-sm text-center py-1">
        FREE SHIPPING on orders over $300
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        classification={navCategories}
        expandedMenus={expandedMenus}
        toggleMenu={toggleMenu}
      />
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Main Header */}
      <header className="bg-white shadow px-6 py-4 flex items-center justify-between relative z-30">
        {/* Left: Logo + Nav */}
        <div className="flex items-center space-x-4 w-full lg:w-auto">
          <div className="lg:hidden">
            <FaBars
              className="text-2xl text-gray-700 cursor-pointer"
              onClick={() => setDrawerOpen(true)}
            />
          </div>
          <Logo />
          <DesktopNav classification={navCategories} />
        </div>

        {/* Right: Auth, Cart on top, Search below */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSearch(prev => !prev)}
            className="flex flex-col items-center text-gray-700 hover:text-black transition"
            aria-label="Toggle search bar"
          >
            <FaSearch className="text-xl" />
          </button>
          <div className="hidden lg:block">
            <React.Suspense fallback={null}>
              <AuthButton />
            </React.Suspense>
          </div>
          <CartIndicator count={total} />
        </div>
      </header>

      {/* Search Bar Below Header */}
      {showSearch && (
        <div className="w-full border-t border-gray-200 bg-white py-4 px-4 flex justify-center">
          <div className="max-w-3xl w-full">
            <SearchBar onClose={() => setShowSearch(false)} />
          </div>
        </div>
      )}

    </>
  );
}
