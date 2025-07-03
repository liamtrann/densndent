import React from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";
import { ProductImage, Paragraph } from "../common";
import { useNavigate } from "react-router-dom";

export default function ListProduct({ product }) {
  const { id, itemid, file_url, price, totalquantityonhand } = product;
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/product/${id}`);
  };

  const inStock = totalquantityonhand && totalquantityonhand > 0;

  return (
    <div className="border p-4 rounded shadow hover:shadow-md transition">
      <div className="cursor-pointer" onClick={handleNavigate}>
        <ProductImage src={file_url} />
      </div>
      <h3
        className="text-sm font-medium text-gray-900 mb-1 cursor-pointer hover:underline"
        onClick={handleNavigate}
      >
        {itemid}
      </h3>
      <p className="font-semibold text-gray-800 mb-2">${price}</p>
      {inStock ? (
        <Paragraph className="text-green-700 font-semibold mb-2">
          Current Stock: {totalquantityonhand}
        </Paragraph>
      ) : (
        <Paragraph className="text-red-600 font-semibold mb-2">
          Out of stock
        </Paragraph>
      )}
      <Button className="w-full mb-2" disabled={!inStock}>
        ADD TO SHOPPING CART
      </Button>
    </div>
  );
}
