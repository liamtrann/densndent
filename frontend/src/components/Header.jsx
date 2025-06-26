// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { AuthButton, Image } from "../common";
import { URLS } from "../constants/urls";

export default function Header() {
  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
      {/* LEFT: Logo and Brand */}
      <div className="flex items-center space-x-3">
        <Image src={URLS.LOGO} alt="Smiles First Logo" className="h-8" />
        <span className="text-xl font-bold text-orange-600">Dens 'n Dente USA</span>
      </div>

      {/* RIGHT: Auth and Cart */}
      <div className="flex items-center space-x-4">
        <AuthButton />

        {/* Cart Icon */}
        <Link to="/cart" className="relative">
          <FaShoppingCart className="text-xl text-orange-600 hover:text-orange-700" />
          {/* Optional badge: */}
          {/* <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">2</span> */}
        </Link>
      </div>
    </header>
  );
}
