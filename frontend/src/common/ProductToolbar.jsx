import React from "react";

export default function ProductToolbar({ total }) {
  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div className="text-sm font-medium tracking-wide">{total} PRODUCTS</div>
      <div className="flex items-center space-x-4">
        <div>
          Show:{" "}
          <select className="border px-2 py-1 text-sm">
            {[12, 24, 48, 56, 72, 88].map((count) => (
              <option key={count}>{count} per page</option>
            ))}
          </select>
        </div>
        <div>
          Sort by:{" "}
          <select className="border px-2 py-1 text-sm">
            <option>Price, low to high</option>
            <option>Price, high to low</option>
          </select>
        </div>
      </div>
    </div>
  );
}
