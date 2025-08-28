import React from "react";

import ListProduct from "./ListProduct"; // Renders each product card

export default function ListGrids({ products }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {products.map((product) => (
        <ListProduct key={product.id} product={product} listType="grid" />
      ))}
    </div>
  );
}
