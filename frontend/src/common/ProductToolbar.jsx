import React from "react";

const SORT_OPTIONS = [
  { value: "", label: "By Default" },
  { value: "asc", label: "Price, low to high" },
  { value: "desc", label: "Price, high to low" },
];

export default function ProductToolbar({
  perPageOptions = [12, 24, 48],
  onPerPageChange,
  perPage = 12,
  sort = "",
  onSortChange,
  total = 0,
}) {
  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div className="text-sm font-medium tracking-wide">{total} PRODUCTS</div>
      <div className="flex items-center space-x-4">
        <div>
          Show:{" "}
          <select
            className="border px-2 py-1 text-sm"
            value={perPage}
            onChange={onPerPageChange}
          >
            {perPageOptions.map((count) => (
              <option key={count} value={count}>
                {count} per page
              </option>
            ))}
          </select>
        </div>
        <div>
          Sort by:{" "}
          <select
            className="border px-2 py-1 text-sm"
            value={sort}
            onChange={onSortChange}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
