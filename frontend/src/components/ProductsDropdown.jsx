import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function ProductsDropdown({ categories }) {
  const [open, setOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const timer = useRef();

  const enter = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };

  const leave = () => {
    timer.current = setTimeout(() => {
      setOpen(false);
      setHoveredCategory(null);
    }, 200);
  };

  const handleCategoryHover = (name) => {
    setHoveredCategory(name);
  };

  return (
    <div
      className="relative"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <span className="text-sm text-gray-800 hover:text-orange-600 font-medium">
        Products
      </span>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-auto bg-white shadow-xl border rounded-md flex z-50">
          {/* Left Column - Categories */}
          <div className="w-48 p-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                onMouseEnter={() => handleCategoryHover(cat.name)}
                className={`px-4 py-2 text-sm flex justify-between items-center hover:bg-gray-100 cursor-pointer ${hoveredCategory === cat.name ? "bg-gray-100" : ""
                  }`}
              >
                {cat.name}
                <span className="text-gray-400">&gt;</span>
              </div>
            ))}
          </div>

          {/* Right Column - Only when hovering a category */}
          {hoveredCategory && (
            <div className="w-60 border-l p-4">
              {(() => {
                const hoveredCat = categories.find((cat) => cat.name === hoveredCategory);
                if (!hoveredCat || !Array.isArray(hoveredCat.subcategories)) return null;
                return hoveredCat.subcategories.map((sub) => {
                  const name = (sub.name || '').replace(/\s+/g, '');
                  const id = sub.id || '';
                  return (
                    <Link
                      key={name + (id ? `-${id}` : '')}
                      to={id ? `/products/by-class/${name.toLowerCase()}-${id}` : `/products/by-class/${name.toLowerCase()}`}
                      className="block px-4 py-2 text-sm hover:bg-orange-50"
                      onClick={() => setOpen(false)}
                    >
                      {sub.name}
                    </Link>
                  );
                });
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
