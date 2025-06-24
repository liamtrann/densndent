// src/components/PromotionsGrid.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function PromotionsGrid() {
  return (
    <section className="mt-10 px-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Q2 Promotions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <img
            src="/q2/topical-anesthetic.png"
            alt="Topical Anesthetic"
            className="h-32 mx-auto object-contain mb-2"
          />
          <p className="text-xs text-orange-600 font-bold">Our House Brand</p>
          <h3 className="font-semibold text-lg mt-1">TOPICAL ANESTHETIC</h3>
          <p className="text-sm text-red-600 font-semibold">BUY 3 GET 1 FREE</p>
          <p className="text-gray-600 text-sm">
            Net <span className="font-semibold">$8.99</span>{" "}
            <span className="line-through text-gray-400">$11.99</span>
          </p>

          {/* ✅ Link wraps the whole button */}
          <Link to="/product/topical-anesthetic">
            <button className="mt-3 w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition">
              Shop Now
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
