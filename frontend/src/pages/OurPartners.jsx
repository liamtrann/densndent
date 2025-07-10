// src/pages/PartnersPage.jsx
import React from "react";
import { Breadcrumb, Paragraph } from "../common";
import { Image } from "../common";
import { URLS } from "../constants/urls";

const partnerKeys = [
  "3m", "aurelia", "dmg", "kerr", "keystone",
  "microcopy", "johnson-and-johnson", "dentsply",
  "diadent", "medicom", "premier", "surgical-specialties",
  "flight", "mark3"
];

const partners = partnerKeys.map(key => ({
  key,
  url: URLS.BRANDS[key],
  name: key.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
}));

export default function PartnersPage() {
  return (
    <div className="px-4 py-12 max-w-7xl mx-auto text-gray-800">
      <Breadcrumb path={["Home", "Our Partners"]} />

      <h1 className="text-4xl font-light text-orange-500 text-center mb-4">Our Partners</h1>
      <Paragraph className="text-center mb-8 max-w-3xl mx-auto">
        We proudly partner with the industry’s leading brands to bring you the highest quality
        dental and medical products. Below are some of our trusted partners.
      </Paragraph>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center justify-center">
        {partners.map(({ key, url, name }) => (
          <div key={key} className="flex items-center justify-center p-4 bg-white border rounded shadow-sm hover:shadow-md transition">
            <Image
              src={url}
              alt={name}
              className="h-12 object-contain max-w-[120px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
