import React from "react";

export default function CategoryTiles() {
  return (
    <section className="mt-10 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
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
      ].map(({ title, img, links }) => (
        <div key={title} className="bg-white rounded-xl shadow-md overflow-hidden">
          <img src={img} alt={title} className="w-full h-36 object-cover" />
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2 text-gray-800">{title}</h3>
            <ul className="space-y-1 text-sm text-blue-600">
              {links.map((link) => (
                <li key={link} className="hover:underline cursor-pointer">{link}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </section>
  );
}
