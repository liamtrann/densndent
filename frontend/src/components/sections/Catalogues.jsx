// src/sections/Catalogue.jsx
import React from "react";
import { Button } from "common";
import { Link } from "react-router-dom";

export default function Catalogues() {
  return (
    <section className="bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8">
        {/* Left: Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-[#215381] mb-4">Catalogues</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Browse our catalogues for exclusive discounts on dental supplies,
            instruments, equipment, and disposables.
          </p>
          <Link to="/promotions/monthly-special">
            <Button variant="primary" className="px-6 py-2">
              Shop Now
            </Button>
          </Link>
        </div>

        {/* Right: Image */}
        <div className="lg:w-1/2 flex justify-center">
          <img
            src="https://www.densndente.ca/site/extra%20images/Dens%20website%20change%20May%202023/catalogue-banner-new.png"
            alt="Catalogues"
            className="rounded-lg shadow-lg max-h-[320px] object-contain"
          />
        </div>
      </div>
    </section>
  );
}
