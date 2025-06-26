import React, { useState } from "react";
import ListProduct from "../components/ListProduct";

const sampleData = [
  {
    name: "D2: Denture Boxes Medium Asst Colors 12/Box - DB-002",
    img: "/q2/denture-box.png",
    price: "8.99",
  },
  {
    name: "D2: Full Face Shield Ea - FS-EA",
    img: "/q2/full-face-shield.png",
    price: "2.50",
  },
  {
    name: "D2: Air/Water Stainless Steel Tips Ea - M7500",
    img: "/q2/air-water-tips.png",
    price: "4.99",
  },
  {
    name: "D2: Glass Dappen Dish - D2GDD",
    img: "/q2/dappen-dish.png",
    price: "4.99",
  },
  {
    name: "D2: Earloop Mask ASTM 50/Bx",
    img: "/q2/earloop-mask.png",
    price: "5.99",
  },
  {
    name: "D2: Spatula Blue Each - SPL-001",
    img: "/q2/spatula-blue.png",
    price: "6.99",
  },
  {
    name: "D2: Autoclavable Silicone Bib Holder Blue - BCA-003",
    img: "/q2/bib-holder.png",
    price: "7.99",
  },
  {
    name: "D2: Sterilization Indicating Tape 1\" SPI110-1",
    img: "/q2/sterilization-tape.png",
    price: "7.99",
  },
  {
    name: "D2 Mixing Bowls Large Flexible Rubber - MB",
    img: "/q2/mixing-bowls.png",
    price: "8.99",
  },
];


const AllList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = sampleData.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(sampleData.length / productsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentProducts.map((item, idx) => (
          <ListProduct key={idx} product={item} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 space-x-4 text-base font-medium">
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-2 ${
              currentPage === num
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-800 hover:text-orange-600"
            }`}
          >
            {num}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="text-gray-800 hover:text-orange-600"
          >
            NEXT
          </button>
        )}
      </div>
    </div>
  );
};

export default AllList;
