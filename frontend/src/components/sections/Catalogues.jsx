// src/sections/Catalogue.jsx
import React from "react";
import { InfoBanner } from "../../common";

export default function Catalogues() {
  return (
    <InfoBanner
      title="Catalogues"
      titleClass="text-smiles-orange"
      description="Browse our catalogues for exclusive discounts on dental supplies, instruments, equipment, and disposables."
      descriptionClass="mb-4"
      imageSrc="/catalogue-banner.png"
      imageAlt="Catalogues"
      buttonText="Shop Now"
      buttonClass="px-5 py-2"
      sectionClass="bg-white"
    />
  );
}
