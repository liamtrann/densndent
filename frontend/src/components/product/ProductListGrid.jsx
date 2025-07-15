import React from "react";
import ListProduct from "./ListProduct"; // Renders each product card

export default function ProductListGrid({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ListProduct key={product.id} product={product} />
      ))}
    </div>
  );
}
