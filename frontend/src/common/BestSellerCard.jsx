import React from "react";
import { ProductImage } from '../common';

export default function BestSellerCard(props) {
  // Helper to truncate text
  const truncate = (str, max = 30) =>
    str && str.length > max ? str.slice(0, max - 1) + '…' : str;

  return (
    <div className="shadow-md rounded-lg p-3 bg-white">
      <ProductImage src={props.file_url} className="mx-auto h-48 object-contain mb-2" />
      {/* <p className="text-xs text-gray-600">{props.brand}</p> */}
      <h3 className="font-bold text-sm" title={props.itemid}>
        {truncate(props.itemid)}
      </h3>
    </div>
  );
}
