import React from "react";
import { Button, Image, Paragraph } from '../common';

export default function HeroPromotion({
  title,
  subtitle,
  offer,
  description,
  buttonText,
  promoCode,
  imageSrc,
  imageAlt
}) {
  return (
    <div className="">
      <div>
        <h1 className="text-3xl font-bold text-smiles-orange mb-2">{title}</h1>
        <Paragraph className="text-lg text-smiles-orange">{offer}</Paragraph>
        <Paragraph className="text-gray-600 mb-3">{description}</Paragraph>
        <Paragraph className="text-xs text-gray-500 mt-1">{promoCode}</Paragraph>
      </div>

      {/* Only render image if imageSrc exists */}
      {imageSrc && imageSrc.trim() !== "" && (
        <Image src={imageSrc} alt={imageAlt} className="h-44 object-contain" />
      )}
    </div>
  );
}
