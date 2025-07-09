// src/components/DesktopNav.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductsDropdown from './ProductsDropdown';

export default function DesktopNav({ categories }) {
  const [aboutOpen, setAboutOpen] = useState(false);

  const aboutMenuItems = [
    { label: "About Us", path: "/about" },
    { label: "Meet Our Team", path: "/team" },
    { label: "FAQs", path: "/faqs" },
    { label: "Contact Us", path: "/contact" },
    { label: "Blog", path: "/blog" },
  ];

  return (
    <nav className="hidden lg:flex items-center space-x-8 mx-auto relative">
      {/* Home */}
      <Link to="/" className="text-sm text-gray-800 hover:text-orange-600 font-medium">
        Home
      </Link>

      {/* Products Dropdown */}
      <ProductsDropdown categories={categories} />

      {/* Promotions & Catalogues Dropdown */}
      <div className="relative group">
        <span className="text-sm font-medium uppercase cursor-pointer text-gray-800 hover:text-orange-600">
          Promotions & Catalogues
        </span>

        <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border rounded w-72 z-50 hidden group-hover:block">
          <ul className="py-3 px-4 space-y-2 text-sm text-gray-800">
            <li>
              <Link to="/promotions/jdiq" className="block hover:underline">
                JDIQ Raffle Winners
              </Link>
            </li>
            <li>
              <Link to="/promotions/monthly" className="block hover:underline">
                Monthly Specials
              </Link>
            </li>
            <li>
              <Link to="/promotions/q3-d2" className="block hover:underline">
                Q3 D2 Specials (House Brand)
              </Link>
            </li>
            <li>
              <Link to="/promotions/q3-vendor" className="block hover:underline flex justify-between items-center">
                Q3 Vendor Specials
                <span className="text-gray-400">›</span>
              </Link>
            </li>
            <li>
              <Link to="/promotions/q3-catalogue" className="block hover:underline">
                Q3 Catalogue
              </Link>
            </li>
            <li>
              <Link to="/promotions/gift-card" className="block hover:underline">
                DND Gift Card Program
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Clearance */}
      <Link to="/clearance" className="text-sm text-gray-800 hover:text-orange-600 font-medium">
        Clearance
      </Link>

      {/* Our Partners */}
      <Link to="/partners" className="text-sm text-gray-800 hover:text-orange-600 font-medium">
        Our Partners
      </Link>

      {/* ABOUT US Dropdown */}
      <div
        className="relative group"
        onMouseEnter={() => setAboutOpen(true)}
        onMouseLeave={() => setAboutOpen(false)}
      >
        <span className={`text-sm font-medium uppercase cursor-pointer ${aboutOpen ? 'text-orange-600 border-b-2 border-black' : 'text-gray-800 hover:text-orange-600'}`}>
          ABOUT US
        </span>

        {aboutOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border rounded w-56 z-50">
            {aboutMenuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
