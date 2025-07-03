// src/components/Header/ProductsDropdown.jsx
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function ProductsDropdown({ categories }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const timer = useRef();

  const enter = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };
  const leave = () => {
    timer.current = setTimeout(() => {
      setOpen(false);
      setHovered(null);
    }, 200);
  };

  return (
    <div
      className="relative"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <span className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">
        Products
      </span>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-[600px] bg-white shadow-xl border rounded-md p-4 flex z-50">
          {/* Main categories */}
          <div className="w-1/2">
            {categories.map(cat => (
              <div
                key={cat.name}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                onMouseEnter={() => setHovered(cat.name)}
              >
                <span className="text-sm">{cat.name}</span>
                <span className="text-gray-400">&gt;</span>
              </div>
            ))}
          </div>
          {/* Subcategories */}
          <div className="w-1/2 border-l pl-4">
            {hovered &&
              categories
                .find(c => c.name === hovered)
                .subcategories.map(sub => (
                  <Link
                    key={sub}
                    to={`/products/${hovered.toLowerCase()}/${sub.toLowerCase()}`}
                    className="block px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm"
                    onClick={() => setOpen(false)}
                  >
                    {sub}
                  </Link>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
