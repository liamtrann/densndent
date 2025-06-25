import React from "react";
import { CategoryTile } from '../common';

const categoryData = [
  {
    title: "Supplies & Small Equipment",
    img: "/supplies.jpg",
    links: [
      "Order from History", "Browse Supplies", "Speed Entry", "Sales & Promotions",
      "Shopping Lists", "Catalogues & Flyers", "Featured Brands"
    ],
  },
  {
    title: "Equipment & Technology",
    img: "/equipment.jpg",
    links: ["About Equipment & Technology"],
  },
  {
    title: "Thrive Rewards",
    img: "/thrive-rewards.jpg",
    links: [
      "About Thrive Rewards", "Thrive Rewards Benefits", "Thrive FAQs",
      "Thrive Promotions", "Terms & Conditions",
    ],
  },
];

export default function CategoryTiles() {
  return (
    <section className="mt-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {categoryData.map((props) => (
        <CategoryTile key={props.title} {...props} />
      ))}
    </section>
  );
}
