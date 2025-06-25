import React from "react";
import { Link } from "react-router-dom";
import { Button, Image } from './index';

export default function PromotionCard({ image, alt, brand, title, offer, price, oldPrice, link }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-center">
      <Image src={image} alt={alt} className="h-32 mx-auto object-contain mb-2" />
      {brand && <p className="text-xs text-smiles-orange font-bold">{brand}</p>}
      <h3 className="font-semibold text-lg mt-1">{title}</h3>
      {offer && <p className="text-sm text-red-600 font-semibold">{offer}</p>}
      <p className="text-gray-600 text-sm">
        Net <span className="font-semibold">{price}</span>{" "}
        {oldPrice && <span className="line-through text-gray-400">{oldPrice}</span>}
      </p>
      {link && (
        <Link to={link}>
          <Button variant="primary" className="mt-3 w-full px-4 py-2">
            Shop Now
          </Button>
        </Link>
      )}
    </div>
  );
}
