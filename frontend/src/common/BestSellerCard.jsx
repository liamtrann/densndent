import React from "react";
import { Image } from '../common';

export default function BestSellerCard({ name, brand, img }) {
  return (
    <div className="shadow-md rounded-lg p-3 bg-white">
      <Image src={img} alt={name} className="mx-auto h-24 object-contain mb-2" />
      <p className="text-xs text-gray-600">{brand}</p>
      <h3 className="font-bold text-sm">{name}</h3>
    </div>
  );
}
