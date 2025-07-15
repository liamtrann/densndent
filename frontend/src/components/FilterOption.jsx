import React from "react";
import FilterSidebar from "./FilterSidebar";

export default function FilterOption({
  onApplyFilters,
  className = "",
  filters,
  onFiltersChange,
}) {
  return (
    <div className={`w-[240px] shrink-0 ${className}`}>
      <FilterSidebar filters={filters} onFiltersChange={onFiltersChange} />
      <div className="mt-4 pt-4 border-t">
        <button
          onClick={onApplyFilters}
          className="w-full bg-smiles-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
