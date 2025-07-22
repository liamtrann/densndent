// src/components/Footer.jsx
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaGooglePlusG,
} from "react-icons/fa";
import { URLS } from "constants/urls";
import { Image, AppLink } from "common";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 mt-12 py-10 border-t dark:border-gray-700 text-gray-700 dark:text-gray-300">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-700">
        {/* Logo and Social */}
        <div className="flex flex-col items-center w-full max-w-[160px] mx-auto">
          <Image
            src={URLS.LOGO}
            className="w-full max-w-[120px] mx-auto mb-2"
          />
          <div className="flex space-x-3 w-full justify-center">
            <AppLink href={URLS.SOCIAL.FACEBOOK}>
              <FaFacebookF className="hover:text-blue-600 text-xl" />
            </AppLink>
            <AppLink href={URLS.SOCIAL.LINKEDIN}>
              <FaLinkedinIn className="hover:text-blue-700 text-xl" />
            </AppLink>
            <AppLink href={URLS.SOCIAL.GOOGLE_PLUS}>
              <FaGooglePlusG className="hover:text-red-600 text-xl" />
            </AppLink>
            <AppLink href={URLS.SOCIAL.INSTAGRAM}>
              <FaInstagram className="hover:text-pink-500 text-xl" />
            </AppLink>
            <AppLink href={URLS.SOCIAL.YOUTUBE}>
              <FaYoutube className="hover:text-red-600 text-xl" />
            </AppLink>
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
            <li>
              <AppLink href="/privacy-policy">Privacy Policy</AppLink>
            </li>
            <li>
              <AppLink href="/terms">
                Terms & Conditions / Refund Policy
              </AppLink>
            </li>
            <li>
              <AppLink href="/returns">Web Store Return Process</AppLink>
            </li>
            <li>
              <AppLink href="/pickup">Pick Up Process</AppLink>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
        © {new Date().getFullYear()} Smiles First Corporation. All rights
        reserved.
      </div>
    </footer>
  );
}
