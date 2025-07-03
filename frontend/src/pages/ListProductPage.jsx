import React from "react";
import Breadcrumb from "../common/Breadcrumb";
import FilterSidebar from "../components/FilterSidebar";
import ProductToolbar from "../common/ProductToolbar";
import ProductListGrid from "../components/ProductListGrid";


const sampleProducts = [
  {
    id: 1,
    name: "Silmet: Spherodon M 50 Capsules Regular Set 2 Spill - 121472",
    img: "/amalgam-1.jpg",
    price: "119.99",
  },
  {
    id: 2,
    name: "Silmet: Spherodon M 50 Capsules Regular Set 1 Spill - 121471",
    img: "/amalgam-2.jpg",
    price: "119.99",
  },
  {
    id: 3,
    name: "Silmet: Spherodon M - 50 Capsules Fast Set 1 Spill - 120471",
    img: "/amalgam-3.jpg",
    price: "119.99",
  },
  {
    id: 4,
    name: "Silmet: Spherodon M (Silmet) - 50 Capsules Fast Set 3 Spill - 120473",
    img: "/amalgam-4.jpg",
    price: "119.99",
  },
];

export default function ListProductPage() {
  return (
    <div className="px-6 py-8 max-w-screen-xl mx-auto">
      <Breadcrumb path={["Home", "Products", "Alloys", "Amalgam"]} />
      <h1 className="text-3xl font-bold text-smiles-blue mb-6">AMALGAM</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar />
        <main className="flex-1">
          <ProductToolbar total={sampleProducts.length} />
          <ProductListGrid products={sampleProducts} />
        </main>
      </div>
    </div>
  );
}
