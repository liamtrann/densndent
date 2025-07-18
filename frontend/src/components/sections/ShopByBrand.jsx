// components/sections/ShopByBrand.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Image } from "common";
import { URLS } from "constants/urls";
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
    <BlueBanner
      title="Shop By Brands"
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
  );
}
