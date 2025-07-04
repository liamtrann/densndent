// src/components/DesktopNav.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ProductsDropdown from './ProductsDropdown';

export default function DesktopNav({ categories }) {
  return (
    <nav className="hidden lg:flex items-center space-x-8 mx-auto">
      <Link to="/" className="text-sm text-gray-800 hover:text-orange-600 font-medium">Home</Link>
      <ProductsDropdown categories={categories} />
      <Link to="/promotions" className="text-sm text-gray-800 hover:text-orange-600 font-medium">Promotions & Catalogues</Link>
      <Link to="/clearance" className="text-sm text-gray-800 hover:text-orange-600 font-medium">Clearance</Link>
      <Link to="/partners" className="text-sm text-gray-800 hover:text-orange-600 font-medium">Our Partners</Link>
      <Link to="/about" className="text-sm text-gray-800 hover:text-orange-600 font-medium">About Us</Link>
    </nav>
  );
}
