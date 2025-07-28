// src/components/GlovesHighlight.jsx
import React from "react";
import { InfoBanner } from "common";

export default function GlovesHighlight() {
  return (
    <InfoBanner
      title="Gloves"
      description="Ensure safety and comfort with high-quality dental gloves — essential supplies in every clinic's inventory of dental products and accessories."
      buttonText="Shop Now"
      buttonLink="/products/by-category/Gloves-9" // ✅ Replace 9 with your actual category ID if needed
      imageSrc="/gloves-banner.png"
      sectionClass="bg-smiles-white/10"
    />
  );
}
