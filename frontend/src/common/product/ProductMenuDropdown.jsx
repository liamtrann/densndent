import React, { useState, useRef } from "react";

export default function ProductMenuDropdown({ categories }) {
  const [isHovered, setHovered] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const hoverTimeout = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout.current);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setHovered(false);
      setHoveredCategory(null);
    }, 200);
  };

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <span className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">
        Products
      </span>

      {isHovered && (
        <div className="absolute left-0 top-full mt-2 w-[600px] bg-white shadow-xl border rounded-md p-4 flex z-50">
          {/* Main Categories */}
          <div className="w-1/2">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                onMouseEnter={() => setHoveredCategory(cat.name)}
              >
                <span className="text-sm">{cat.name}</span>
                <span className="text-gray-400">&gt;</span>
              </div>
            ))}
          </div>

          {/* Subcategories */}
          <div className="w-1/2 border-l pl-4">
            {hoveredCategory &&
              categories
                .find((cat) => cat.name === hoveredCategory)
                ?.subcategories.map((sub) => (
                  <div
                    key={sub}
                    className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-sm"
                  >
                    {sub}
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
