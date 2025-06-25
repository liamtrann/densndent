import React from "react";
import { Button, Image } from '../common';

export default function GlovesHighlight() {
  return (
    <section className="flex flex-col md:flex-row justify-between items-center gap-6 px-6 py-12 bg-smiles-orange/10">
      <div className="max-w-md">
        <h2 className="text-3xl font-bold text-smiles-blue mb-3">Gloves</h2>
        <p className="text-gray-700 mb-4">
          Ensure safety and comfort with high-quality dental gloves — essential supplies in every clinic's inventory.
        </p>
        <Button variant="primary" className="px-5 py-2">
          Shop Now
        </Button>
      </div>
      <Image src="/gloves-banner.png" alt="Gloves" className="w-full md:w-1/2 rounded-lg" />
    </section>
  );
}
