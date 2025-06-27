// src/components/Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import AuthButton from "../common/AuthButton";

export default function Header() {
  const [isProductsHovered, setProductsHovered] = useState(false);

  return (
    <header className="bg-white shadow px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* LEFT SIDE: Logo + Navigation */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Smiles First Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-orange-600">Dens 'n Dente USA</span>
          </Link>

          {/* Main Nav */}
          <nav className="flex space-x-4 ml-4 relative">
            <Link to="/" className="text-sm text-gray-700 hover:text-orange-600">
              Home
            </Link>

            {/* Products with Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setProductsHovered(true)}
              onMouseLeave={() => setProductsHovered(false)}
            >
              <span className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">
                Products
              </span>

              {isProductsHovered && (
                <div className="absolute left-0 top-full mt-2 w-[80vw] bg-white shadow-lg border rounded-lg p-6 grid grid-cols-4 gap-6 z-40">
                  {/* Column 1 */}
                  <div>
                    <h4 className="font-semibold mb-2">D2 (House Brand)</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li><Link to="/category/d2-products">All D2 Products</Link></li>
                    </ul>
                  </div>

                  {/* Column 2 */}
                  <div>
                    <h4 className="font-semibold mb-2">Anesthetics</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li><Link to="/category/injectables">Injectables</Link></li>
                      <li><Link to="/category/needles">Needles</Link></li>
                      <li><Link to="/category/sutures">Sutures</Link></li>
                      <li><Link to="/category/topical">Topical</Link></li>
                    </ul>
                  </div>

                  {/* Column 3 */}
                  <div>
                    <h4 className="font-semibold mb-2">Endodontics</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li><Link to="/category/absorbent-points">Absorbent Points</Link></li>
                      <li><Link to="/category/endo-files">Endo Files</Link></li>
                      <li><Link to="/category/sealers">Sealers</Link></li>
                    </ul>
                  </div>

                  {/* Column 4 */}
                  <div>
                    <h4 className="font-semibold mb-2">Equipment</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li><Link to="/category/autoclave">Autoclave</Link></li>
                      <li><Link to="/category/chairs-stools">Chairs & Stools</Link></li>
                      <li><Link to="/category/x-ray">X-Ray Equipment</Link></li>
                    </ul>
                  </div>

                  {/* Add more columns as needed */}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* RIGHT SIDE: Auth + Cart */}
        <div className="flex items-center space-x-4">
          <AuthButton />
          <Link to="/cart">
            <FaShoppingCart className="text-xl text-orange-600 hover:text-orange-700" />
          </Link>
        </div>
      </div>
    </header>
  );
}
