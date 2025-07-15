import React from "react";
import { Button, Image, Paragraph } from '../../common';

export default function ProductGrid() {
  return (
    <section className="mt-10 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          title: "Sweet Summer Savings",
          desc: "Enjoy limited-time offers on your favourite dental essentials.",
          img: "/june-flyer.png",
          cta: "See Flyer",
        },
        {
          title: "Fluorides, Toothbrushes and Floss",
          desc: "Henry Schein Brand, 3M, Oral B, and Medicom. Must use promo code: WA",
          img: "/fluoride-products.png",
          cta: "Shop Now",
        },
        {
          title: "A-dec Equipment",
          desc: "Reliable performance backed by A-dec's 10-year warranty.",
          img: "/adec-warranty.png",
          cta: "Get Protected with A-dec",
        },
      ].map(({ title, desc, img, cta }) => (
        <div key={title} className="bg-white shadow-md rounded-lg overflow-hidden">
          <Image src={img} alt={title} className="w-full h-36 object-cover" />
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
            <Paragraph className="text-sm text-gray-600 mt-1">{desc}</Paragraph>
            <Button variant="primary" className="mt-3 px-4 py-2">
              {cta}
            </Button>
          </div>
        </div>
      ))}
    </section>
  );
}
