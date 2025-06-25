import React from "react";
import { Button, Image } from '../common';

export default function FAQs() {
  return (
    <section className="bg-smiles-orange/10 px-6 py-10 flex flex-col md:flex-row items-center justify-between">
      <div className="max-w-md">
        <h2 className="text-3xl font-bold text-smiles-orange mb-3">FAQs</h2>
        <p className="text-gray-700 mb-4">
          Get quick answers about ordering, shipping, returns, and how to shop for dental supplies and products on our website.
        </p>
        <Button variant="primary" className="px-5 py-2">
          Learn More
        </Button>
      </div>
      <Image src="/faq-banner.png" alt="FAQs" className="w-full md:w-1/2 mt-6 md:mt-0 rounded-lg" />
    </section>
  );
}
