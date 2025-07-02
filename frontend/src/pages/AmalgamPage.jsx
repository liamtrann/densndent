import React from "react";
import ListProduct from "../common/ListProduct"; // Make sure this component exists and is the styled product box
import { useNavigate } from "react-router-dom";

const sampleAmalgamProducts = [
  {
    id: 1,
    name: "Silmet: Spherodon M 50 Capsules Regular Set 2 Spill - 121472",
    price: "$119.99",
    image: "/amalgam-1.png",
    outOfStock: true,
  },
  {
    id: 2,
    name: "Silmet: Spherodon M 50 Capsules Regular Set 1 Spill - 121471",
    price: "$119.99",
    image: "/amalgam-2.png",
    outOfStock: true,
  },
  {
    id: 3,
    name: "Silmet: Spherodon M 50 Capsules Fast Set 1 Spill - 120471",
    price: "$119.99",
    image: "/amalgam-3.png",
    outOfStock: true,
  },
];

export default function AmalgamPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-smiles-blue mb-4">AMALGAM</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleAmalgamProducts.map((product) => (
          <ListProduct key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
