import React from "react";
import { InfoBanner } from "../common";

export default function FAQsHighlight() {
  return (
    <InfoBanner
      title="FAQs"
      titleClass="text-smiles-blue"
      description="Get quick answers about ordering, shipping, returns, and how to shop for dental supplies and products on our website."
      buttonText="Learn More"
      imageSrc="/faq-banner.png" // Make sure this path points to the proper full-width image
      sectionClass="bg-smiles-white/5"
    />
  );
}
