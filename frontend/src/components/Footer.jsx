// src/components/Footer.jsx
import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaGooglePlusG } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-12 py-10 border-t">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-700">
        
        {/* Logo and Social */}
        <div>
          <img src="/logo.png" alt="Dens 'n Dente Logo" className="h-10 mb-4" />
          <div className="flex space-x-3 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF className="hover:text-blue-600" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn className="hover:text-blue-700" /></a>
            <a href="https://plus.google.com" target="_blank" rel="noopener noreferrer"><FaGooglePlusG className="hover:text-red-600" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram className="hover:text-pink-500" /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube className="hover:text-red-600" /></a>
          </div>
        </div>

        {/* Location */}
        <div>
          <h4 className="font-semibold mb-2 text-blue-800">LOCATION</h4>
          <p>91 Granton Drive,</p>
          <p>Richmond Hill, ON</p>
          <p>L4B 2N5</p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-2 text-blue-800">CONTACT US</h4>
          <p>1-866-449-9998</p>
          <p>905-475-3367</p>
          <p>Fax - 905-475-2894</p>
          <p>info@densndente.ca</p>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold mb-2 text-blue-800">LEGAL</h4>
          <ul className="space-y-1">
            <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:underline">Terms & Conditions / Refund Policy</a></li>
            <li><a href="/returns" className="hover:underline">Web Store Return Process</a></li>
            <li><a href="/pickup" className="hover:underline">Pick Up Process</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="text-center text-xs text-gray-500 mt-8">
        © {new Date().getFullYear()} Smiles First Corporation. All rights reserved.
      </div>
    </footer>
  );
}
