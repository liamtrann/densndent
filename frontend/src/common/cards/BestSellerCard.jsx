//BestSellerCard.jsx
import React from "react";
import ProductImage from "../product/ProductImage";

export default function BestSellerCard(props) {
  // Helper to truncate text
  const truncate = (str, max = 30) =>
    str && str.length > max ? str.slice(0, max - 1) + "…" : str;

  return (
    <div className="shadow-md rounded-lg p-2 sm:p-3 bg-white h-full flex flex-col">
      <ProductImage
        src={props.file_url}
        className="mx-auto h-24 sm:h-32 md:h-40 object-contain mb-2 flex-shrink-0"
      />
      {/* <p className="text-xs text-gray-600">{props.brand}</p> */}
      {/* <h3 className="font-bold text-xs sm:text-sm flex-grow" title={props.itemid}>
        {truncate(props.itemid)}
      </h3> */}
    </div>
  );
}
