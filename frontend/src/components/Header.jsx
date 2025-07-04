// src/components/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import Logo from './Logo';
import MobileDrawer from './MobileDrawer';
import DesktopNav from './DesktopNav';
import CartIndicator from "./CartIndicator";
import AuthButton from "../common/AuthButton";
import { fetchClassifications } from "../redux/slices/classificationSlice";
import { delayCall } from "../api/util";


export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const cartItems = useSelector(s => s.cart.items);
  const total = cartItems.length;

  const dispatch = useDispatch();
  const { classes: categories = [] } = useSelector(s => s.classification || {});

  useEffect(() => {
    if (!categories.length) delayCall(() => dispatch(fetchClassifications()));
  }, [dispatch, categories.length]);

  // Transform for nav: name and id for both category and subcategory
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
        categories={navCategories}
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
        {/* Left: Hamburger + Logo + DesktopNav */}
        <div className="flex items-center space-x-4 w-full lg:w-auto">
          <div className="lg:hidden">
            <FaBars
              className="text-2xl text-gray-700 cursor-pointer"
              onClick={() => setDrawerOpen(true)}
            />
          </div>
          <Logo />
          <DesktopNav categories={navCategories} />
        </div>

        {/* Right: Auth & Cart */}
        <div className="flex items-center space-x-4">
          <div className="hidden lg:block">
            {/* your common/AuthButton */}
            <React.Suspense fallback={null}>
              <AuthButton />
            </React.Suspense>
          </div>
          <CartIndicator count={total} />
        </div>
      </header>
    </>
  );
}
