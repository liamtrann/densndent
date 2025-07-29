import React, { useState, useEffect } from "react";
import { FaBars, FaSearch, FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  Logo,
  MobileDrawer,
  DesktopNav,
  SearchBar,
} from "components/navigation";
import { CartIndicator } from "components/cart";
import { AuthButton } from "common";
import { fetchClassifications } from "store/slices/classificationSlice";
import { delayCall } from "api/util";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const cartItems = useSelector((s) => s.cart.items);
  const total = cartItems.length;
  const dispatch = useDispatch();

  const { classes: categories = [] } = useSelector(
    (s) => s.classification || {}
  );

  useEffect(() => {
    if (!categories.length) delayCall(() => dispatch(fetchClassifications()));
  }, [dispatch, categories.length]);

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const navCategories = categories
    .filter((cat) => Array.isArray(cat.child) && cat.child.length > 0)
    .map((cat) => ({
      name: cat.name,
      id: cat.id,
      subcategories: cat.child.map((sub) => ({ name: sub.name, id: sub.id })),
    }));

  const toggleMenu = (key) =>
    setExpandedMenus((m) => ({ ...m, [key]: !m[key] }));

  return (
    <>
      {/* Free Shipping Banner */}
      <div className="bg-blue-900 text-white text-sm text-center py-1 dark:bg-gray-800">
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
      <header className="bg-white dark:bg-gray-900 shadow px-6 py-4 flex items-center justify-between relative z-30 transition-colors duration-300">
        {/* Left: Logo + Nav */}
        <div className="flex items-center space-x-4 w-full lg:w-auto">
          <div className="lg:hidden">
            <FaBars
              className="text-2xl text-gray-700 dark:text-gray-200 cursor-pointer"
              onClick={() => setDrawerOpen(true)}
            />
          </div>
          <Logo />
          <DesktopNav classification={navCategories} />
        </div>

        {/* Right: Search, Auth, Cart, Dark Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowSearch((prev) => !prev)}
            className="flex flex-col items-center text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white transition"
            aria-label="Toggle search bar"
          >
            <FaSearch className="text-xl" />
          </button>

          {/* DARK MODE TOGGLE */}
          {/* <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full transition-colors bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <FaSun className="text-yellow-300" />
            ) : (
              <FaMoon className="text-gray-800" />
            )}
          </button> */}

          {/* Auth & Cart */}
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
        <div className="w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-4 px-4 flex justify-center">
          <div className="max-w-3xl w-full">
            <SearchBar onClose={() => setShowSearch(false)} />
          </div>
        </div>
      )}
    </>
  );
}
