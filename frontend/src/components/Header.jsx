// src/components/Header/Header.jsx
import React, { useState, useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Logo from './Logo';
import MobileDrawer from './MobileDrawer';
import DesktopNav from './DesktopNav';
import CartIndicator from "./CartIndicator";
import AuthButton from "../common/AuthButton";


const PRODUCT_CATS = [
  { name: 'Alloys', subcategories: ['Amalgam'] },
  { name: 'Anesthetics', subcategories: ['Injectables', 'Needles', 'Sutures', 'Topical'] }
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const cartItems = useSelector(s => s.cart.items);
  const total = cartItems.length;

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
        categories={PRODUCT_CATS}
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
          <DesktopNav categories={PRODUCT_CATS} />
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
