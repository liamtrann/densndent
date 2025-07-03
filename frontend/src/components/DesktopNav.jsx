// src/components/Header/DesktopNav.jsx
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductsDropdown from './ProductsDropdown';

export default function DesktopNav({ categories }) {
  return (
    <nav className="hidden lg:flex items-center space-x-6">
      <Link to="/" className="text-sm text-gray-700 hover:text-orange-600">
        Home
      </Link>
      <ProductsDropdown categories={categories} />
    </nav>
  );
}
