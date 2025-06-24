import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 px-6 py-10 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
        {/* Logo + Social */}
        <div>
          <img src="/logo-footer.png" alt="Dens 'n Dente Logo" className="h-8 mb-4" />
          <div className="flex gap-4 text-xl text-gray-700">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-google-plus-g"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>

        {/* Location */}
        <div>
          <h4 className="font-semibold mb-2 text-blue-800">LOCATION</h4>
          <p>91 Granton Drive,<br />Richmond Hill, ON<br />L4B 2N5</p>
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
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms & Conditions / Refund Policy</a></li>
            <li><a href="#" className="hover:underline">Web Store Return Process</a></li>
            <li><a href="#" className="hover:underline">Pick Up Process</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t mt-8 pt-4 text-center text-gray-500 text-xs">
        &copy; 2025 Smiles First Corporation. All rights reserved.
        <div className="mt-2 space-x-4 text-blue-600">
          <a href="#">LinkedIn</a>
          <a href="#">Instagram</a>
          <a href="#">YouTube</a>
        </div>
      </div>
    </footer>
  );
}
