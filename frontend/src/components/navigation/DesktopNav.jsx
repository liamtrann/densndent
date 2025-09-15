// src/components/DesktopNav.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import ProductsDropdown from "./ProductsDropdown";

export default function DesktopNav({ classification }) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const aboutTimer = useRef(null);
  const promoTimer = useRef(null);

  const handleAboutEnter = () => {
    clearTimeout(aboutTimer.current);
    setAboutOpen(true);
  };
  const handleAboutLeave = () => {
    aboutTimer.current = setTimeout(() => setAboutOpen(false), 200);
  };
  const handlePromoEnter = () => {
    clearTimeout(promoTimer.current);
    setPromoOpen(true);
  };
  const handlePromoLeave = () => {
    promoTimer.current = setTimeout(() => setPromoOpen(false), 200);
  };

  const aboutMenuItems = [
    { label: "About Us", path: "/about" },
    { label: "Meet Our Team", path: "/team" },
    { label: "FAQs", path: "/faq" },
    { label: "Contact Us", path: "/contact" },
    { label: "Blog", path: "/blog" },
  ];

  const promoMenuItems = [
    { label: "Promotions", path: "/promotions" },
    { label: "JDIQ Raffle Winners", path: "/promotions/jdiq" },
    { label: "Monthly Specials", path: "/promotions/monthly-special" },
    // { label: "Q3 D2 Specials (House Brand)", path: "/promotions/q3-d2" },
    // {
    //   label: "Q3 Vendor Specials",
    //   children: [
    //     { label: "Solventum", path: "/promotions/q3-vendor/solventum" },
    //     { label: "Medicom", path: "/promotions/q3-vendor/medicom" },
    //     { label: "4D Rubber", path: "/promotions/q3-vendor/4d-rubber" },
    //     { label: "Ansell", path: "/promotions/q3-vendor/ansell" },
    //     { label: "Aurelia", path: "/promotions/q3-vendor/aurelia" },
    //     { label: "Diadent", path: "/promotions/q3-vendor/diadent" },
    //     { label: "DMG", path: "/promotions/q3-vendor/dmg" },
    //     { label: "Flight", path: "/promotions/q3-vendor/flight" },
    //     { label: "Kuraray", path: "/promotions/q3-vendor/kuraray" },
    //     { label: "Morita", path: "/promotions/q3-vendor/morita" },
    //     { label: "Palmero", path: "/promotions/q3-vendor/palmero" },
    //     { label: "Pulpdent", path: "/promotions/q3-vendor/pulpdent" },
    //     { label: "Sable", path: "/promotions/q3-vendor/sable" },
    //     { label: "Young", path: "/promotions/q3-vendor/young" },
    //     { label: "Zirc", path: "/promotions/q3-vendor/zirc" }
    //   ]
    // },
    // { label: "Q3 Catalogue", path: "/promotions/q3-catalogue" },
    { label: "DND Gift Card Program", path: "/promotions/gift-card" },
  ];

  return (
    <nav className="hidden lg:flex items-center space-x-8 mx-auto relative">
      <Link
        to="/"
        className="text-sm text-gray-800 hover:text-orange-600 font-medium"
      >
        Home
      </Link>
      <ProductsDropdown classification={classification} />

      {/* Promotions & Catalogues */}
      <div
        className="relative"
        onMouseEnter={handlePromoEnter}
        onMouseLeave={handlePromoLeave}
      >
        {/* ⬇️ Make the parent label a link to /promotions */}
        <Link
          to="/promotions"
          className={`text-sm font-medium cursor-pointer ${
            promoOpen
              ? "text-orange-600"
              : "text-gray-800 hover:text-orange-600"
          }`}
        >
          Promotions & Catalogues
        </Link>

        {promoOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border rounded w-72 z-50 transition duration-200">
            <ul className="py-3 px-4 space-y-2 text-sm text-gray-800">
              {promoMenuItems.map((item) => (
                <li key={item.label} className="relative group">
                  {item.children ? (
                    <>
                      <span className="block px-4 py-2 cursor-pointer hover:bg-gray-100">
                        {item.label} &rsaquo;
                      </span>
                      <div className="absolute top-0 left-full ml-1 bg-white shadow-lg border rounded w-48 hidden group-hover:block z-50">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.path}
                            className="block px-4 py-2 hover:bg-gray-100"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Link
        to="/clearance"
        className="text-sm text-gray-800 hover:text-orange-600 font-medium"
      >
        Clearance
      </Link>
      <Link
        to="/partners"
        className="text-sm text-gray-800 hover:text-orange-600 font-medium"
      >
        Our Partners
      </Link>

      {/* ABOUT US */}
      <div
        className="relative"
        onMouseEnter={handleAboutEnter}
        onMouseLeave={handleAboutLeave}
      >
        <span
          className={`text-sm font-medium cursor-pointer ${
            aboutOpen
              ? "text-orange-600 border-b-2 border-black"
              : "text-gray-800 hover:text-orange-600"
          }`}
        >
          About Us
        </span>

        {aboutOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white shadow-lg border rounded w-56 z-50 transition duration-200">
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

      {/* moved MyPage after About Us */}
      <Link
        to="/favorites"
        className="text-sm text-gray-800 hover:text-orange-600 font-medium"
      >
        My Page
      </Link>
    </nav>
  );
}
