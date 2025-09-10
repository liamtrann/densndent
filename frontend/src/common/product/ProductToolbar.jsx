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
  view = "grid",
  onViewChange,
  showPerPage = true,
  showSort = true,
  showViewToggle = true,
}) {
  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
      <div className="text-sm font-medium tracking-wide">{total} PRODUCTS</div>

      <div className="flex items-center gap-3">
        {/* View toggle */}
        {showViewToggle && (
          <div className="flex items-center rounded border overflow-hidden">
            <button
              type="button"
              onClick={() => onViewChange?.("grid")}
              aria-pressed={view === "grid"}
              className={`px-3 py-1 text-sm ${view === "grid" ? "bg-gray-100 font-medium" : ""}`}
              title="Grid view"
            >
              ▦ Grid
            </button>
            <button
              type="button"
              onClick={() => onViewChange?.("list")}
              aria-pressed={view === "list"}
              className={`px-3 py-1 text-sm border-l ${view === "list" ? "bg-gray-100 font-medium" : ""}`}
              title="List view"
            >
              ≣ List
            </button>
          </div>
        )}

        {/* Per page selector */}
        {showPerPage && (
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
        )}

        {/* Sort selector */}
        {showSort && (
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
        )}
      </div>
    </div>
  );
}
