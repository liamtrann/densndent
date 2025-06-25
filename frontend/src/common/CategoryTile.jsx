import React from "react";
import { Image } from './index';

export default function CategoryTile({ title, img, links }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <Image src={img} alt={title} className="w-full h-36 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-gray-800">{title}</h3>
        <ul className="space-y-1 text-sm text-blue-600">
          {links.map((link) => (
            <li key={link} className="hover:underline cursor-pointer">{link}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
