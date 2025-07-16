// src/pages/Q3CataloguePage.jsx
import React from 'react';
import { Paragraph, Button, Breadcrumb } from 'common';

export default function Q3CataloguePage() {
  const path = [
    { name: "Home", link: "/" },
    { name: "Promotions & Catalogues", link: "/promotions" },
    { name: "Q3 Catalogue" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb path={path} />

      <div className="bg-[#215381] text-white p-8 rounded mb-6 text-center relative">
        <h1 className="text-3xl font-semibold tracking-wide uppercase">
          Quarter 3 Catalogue
        </h1>
        <div className="absolute top-4 right-6 text-sm font-light">
          valid July 1st to Sept 30th
        </div>
      </div>

      <Paragraph className="text-gray-700 italic mb-2">
        For BOGO specials, ensure to add total quantity into cart for discount.
        Eg. For Buy 4 Get 2 Free, add 6 into cart.
      </Paragraph>
      <Paragraph className="text-gray-600 italic mb-6">
        **Please note that special pricing cannot be combined with promotional offers.
      </Paragraph>

      <div className="flex justify-center mb-6">
        <Button variant="primary">CLICK FOR FULL VIEW</Button>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Button variant="secondary">BROWSE D2 PRODUCTS</Button>
        <Button variant="secondary">BROWSE VENDOR PROMOS</Button>
      </div>
    </div>
  );
}
