import React from "react";
import { InfoBanner } from '../common';

export default function FAQs() {
  return (
    <InfoBanner
      title="FAQs"
      titleClass="text-smiles-orange"
      description="Get quick answers about ordering, shipping, returns, and how to shop for dental supplies and products on our website."
      descriptionClass="mb-4"
      imageSrc="/faq-banner.png"
      imageAlt="FAQs"
      buttonText="Learn More"
      buttonClass="px-5 py-2"
      sectionClass="bg-smiles-orange/10"
    />
  );
}
