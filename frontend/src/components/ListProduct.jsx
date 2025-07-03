import React from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";
import { ProductImage } from "../common";


export default function ListProduct({ product }) {
  const { itemid, file_url, price } = product;

  return (
    <div className="border p-4 rounded shadow hover:shadow-md transition">
      <ProductImage src={file_url} />
      <h3 className="text-sm font-medium text-gray-900 mb-1">{itemid}</h3>
      <p className="font-semibold text-gray-800 mb-2">${price}</p>

      <Button className="w-full mb-2">ADD TO SHOPPING CART</Button>

      <label className="text-sm flex items-center space-x-2">
        <input type="checkbox" />
        <span>Add to compare</span>
      </label>
    </div>
  );
}
