import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { delayCall } from "../../api/util";
import {
  fetchProductsBy,
  fetchCountBy,
} from "../../redux/slices/productsSlice";
import {
  Breadcrumb,
  ErrorMessage,
  Loading,
  Pagination,
  ProductToolbar,
} from "../../common";
import FilterOption from "../filters/FilterOption";
import ProductListGrid from "./ProductListGrid";
import CartSummaryPanel from "../cart/CartSummaryPanel"; // 👈 Import here
export default function ListProductComponent({
  type,
  id,
  breadcrumbPath,
  headerTitle,
}) {
  const [perPage, setPerPage] = useState(12);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    selectedCategories: [],
    selectedBrands: [],
  });

  const dispatch = useDispatch();
  const key = `${id}_${perPage}_${sort}_${page}`;
  const products = useSelector(
    (state) => state.products.productsByPage[key] || []
  );
  const isLoading = useSelector((state) => state.products.isLoading);
  const error = useSelector((state) => state.products.error);
  // Use either totalByClass or totalByBrand, fallback to totalByClass
  const total = useSelector(
    (state) =>
      state.products.totalByClass?.[id] ||
      state.products.totalByBrand?.[id] ||
      0
  );

  useEffect(() => {
    setPage(1);
    setSort("");
    if (id) {
      return delayCall(() => dispatch(fetchCountBy({ type, id })));
    }
  }, [dispatch, type, id]);

  useEffect(() => {
    if (id) {
      if (!products || products.length === 0) {
        return delayCall(() => {
          dispatch(fetchProductsBy({ type, id, page, limit: perPage, sort }));
        });
      }
    }
  }, [dispatch, type, id, perPage, sort, page, products.length]);

  const totalPages = Math.ceil(total / perPage) || 1;

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleApplyFilters = () => {
    // Here you can trigger a new search with the applied filters
    console.log("Applied filters:", filters);
    // You might want to dispatch a new fetchProductsBy with filters
  };

  return (
    <div className="px-4 lg:px-6 py-6 lg:py-8 max-w-screen-2xl mx-auto">
      <Breadcrumb path={breadcrumbPath} />
      <h1 className="text-2xl lg:text-3xl font-bold text-smiles-blue mb-4 lg:mb-6">
        {headerTitle}
      </h1>

      {/* Desktop: 3-column layout, Mobile: Single column stack */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
        {/* Left Column: Filters - Hidden on mobile, shown on desktop */}
        <FilterOption
          className="hidden lg:block"
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={handleApplyFilters}
        />

        {/* Center Column: Main product area */}
        <div className="flex-1 w-full">
          {/* Mobile filter toggle button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-left flex items-center justify-between"
            >
              <span className="font-medium">Filters & Sort</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  showMobileFilters ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Mobile filters dropdown */}
            {showMobileFilters && (
              <div className="mt-2 bg-white border rounded-lg shadow-lg p-4">
                <FilterOption
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onApplyFilters={() => {
                    handleApplyFilters();
                    setShowMobileFilters(false);
                  }}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <ProductToolbar
            perPageOptions={[12, 24, 48]}
            onPerPageChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            perPage={perPage}
            sort={sort}
            onSortChange={(e) => setSort(e.target.value)}
            total={total}
          />
          <div className="mb-4">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
          {isLoading && <Loading message="Loading products..." />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && products.length === 0 && (
            <div className="text-gray-500 py-8 text-center">
              No products found for this category.
            </div>
          )}
          {!isLoading && !error && products.length > 0 && (
            <ProductListGrid products={products} />
          )}
          {/* Bottom pagination for mobile */}
          <div className="mt-6">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
