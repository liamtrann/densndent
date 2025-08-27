import React from "react";

import FilterSidebar from "./FilterSidebar";

import { Button } from "@/common";

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
        <Button onClick={onApplyFilters} className="w-full mt-2">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
