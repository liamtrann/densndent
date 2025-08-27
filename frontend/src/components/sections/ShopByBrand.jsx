// components/sections/ShopByBrand.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Image, TitleSection } from "common";
import { URLS } from "@/constants/constant";
import BlueBanner from "./BlueBanner";

const brandKeys = [
  "d2",
  "3m",
  "aurelia",
  "dmg",
  "kerr",
  "keystone",
  "microcopy",
  "johnson-and-johnson",
  "dentsply",
  "diadent",
  "medicom",
  "premier",
  "surgical-specialties",
  "flight",
  "mark3",
];

const brands = brandKeys.map((key) => ({
  key,
  url: URLS.BRANDS[key],
  name: key.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
}));

export default function ShopByBrand() {
  return (
    <>
      <TitleSection
        title="Shop By Brands"
        subtitle="Trusted quality from leading manufacturers"
        itemCount={brands.length}
        itemLabel="brands"
        colorScheme="purple"
        icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 713.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 410 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 410-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 713.138-3.138z"
            />
          </svg>
        }
      />
      <BlueBanner
        items={brands}
        columns={{ base: 3, md: 4, lg: 6 }}
        enableHorizontalScroll={false}
        renderItem={({ url, name, key }) => (
          <Link to={`/products/by-brand/${key}`}>
            <Image
              src={url}
              alt={name}
              className="h-12 object-contain hover:scale-105 transition-transform"
            />
          </Link>
        )}
      />
    </>
  );
}
