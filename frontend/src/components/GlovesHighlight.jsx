import React from "react";
import { InfoBanner } from '../common';

export default function GlovesHighlight() {
  return (
    <InfoBanner
      title="Gloves"
      titleClass="text-smiles-blue"
      description="Ensure safety and comfort with high-quality dental gloves — essential supplies in every clinic's inventory of dental products and accessories."
      descriptionClass="mb-4"
      imageSrc="/gloves-banner.png"
      imageAlt="Gloves"
      buttonText="Shop Now"
      buttonClass="px-5 py-2"
      sectionClass="bg-no-repeat bg-cover bg-right"
    />
  );
}
