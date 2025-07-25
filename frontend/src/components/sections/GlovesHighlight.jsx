import React from "react";
import { InfoBanner } from "common";

export default function GlovesHighlight() {
  return (
    <InfoBanner
      title="Gloves"
      description="Ensure safety and comfort with high-quality dental gloves — essential supplies in every clinic's inventory of dental products and accessories."
      buttonText="Shop Now"
      buttonLink="/products/by-name/gloves"
      imageSrc="/gloves-banner.png" // Make sure this image is wide and high-res enough
      sectionClass="bg-smiles-white/10"
    />
  );
}
