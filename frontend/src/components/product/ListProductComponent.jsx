//ListProductComponent.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsBy, fetchCountBy } from "store/slices/productsSlice";

import { delayCall } from "api/util";
import {
  Breadcrumb,
  ErrorMessage,
  Loading,
  Pagination,
  ProductToolbar,
} from "common";

import { ListProduct } from "..";
import FilterOption from "../filters/FilterOption";

export default function ListProductComponent({
  type,
  id,
  breadcrumbPath,
  headerTitle,
}) {
  const [perPage, setPerPage] = useState(12);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    minPrice: "",
    maxPrice: "",
    selectedCategories: [],
    selectedBrands: [],
  });
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    selectedCategories: [],
    selectedBrands: [],
  });

  const dispatch = useDispatch();
  const priceKey = `${appliedFilters.minPrice || ""}_${appliedFilters.maxPrice || ""}`;
  const effectiveId = id || "all";
  const key = `${effectiveId}_${perPage}_${sort}_${priceKey}_${page}`;
  const countKey = `${effectiveId}_${priceKey}`;

  const products = useSelector(
    (state) => state.products.productsByPage[key] || []
  );
  const isLoading = useSelector((state) => state.products.isLoading);
  const error = useSelector((state) => state.products.error);
  const total = useSelector((state) => {
    const count = state.products.totalCounts?.[countKey];
    return count !== undefined ? count : 0;
  });

  // initial count
  useEffect(() => {
    setPage(1);
    setSort("");
    if (id || type === "all") {
      return delayCall(() =>
        dispatch(
          fetchCountBy({
            type,
            id: effectiveId === "all" ? null : effectiveId,
          })
        )
      );
    }
  }, [dispatch, type, id, effectiveId]);

  // filtered count
  useEffect(() => {
    if (
      (id || type === "all") &&
      (appliedFilters.minPrice || appliedFilters.maxPrice)
    ) {
      return delayCall(() =>
        dispatch(
          fetchCountBy({
            type,
            id: effectiveId === "all" ? null : effectiveId,
            minPrice: appliedFilters.minPrice,
            maxPrice: appliedFilters.maxPrice,
          })
        )
      );
    }
  }, [
    dispatch,
    type,
    effectiveId,
    appliedFilters.minPrice,
    appliedFilters.maxPrice,
  ]);

  // product page fetch
  useEffect(() => {
    if (id || type === "all") {
      if (!products || products.length === 0) {
        return delayCall(() => {
          dispatch(
            fetchProductsBy({
              type,
              id: effectiveId === "all" ? null : effectiveId,
              page,
              limit: perPage,
              sort,
              minPrice: appliedFilters.minPrice,
              maxPrice: appliedFilters.maxPrice,
            })
          );
        });
      }
    }
  }, [
    dispatch,
    type,
    effectiveId,
    perPage,
    sort,
    page,
    products.length,
    appliedFilters.minPrice,
    appliedFilters.maxPrice,
  ]);

  const totalPages = Math.ceil(total / perPage) || 1;

  const handleFiltersChange = (newFilters) => setFilters(newFilters);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);

    if (filters.minPrice || filters.maxPrice) {
      dispatch(
        fetchCountBy({
          type,
          id: effectiveId === "all" ? null : effectiveId,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        })
      );
    }
  };

  return (
    <div className="px-4 lg:px-6 py-6 lg:py-8 max-w-screen-2xl mx-auto">
      <Breadcrumb path={breadcrumbPath} />
      <h1 className="text-2xl lg:text-3xl font-bold text-smiles-blue mb-4 lg:mb-6">
        {headerTitle}
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
        {/* Filters (desktop) */}
        {products.length > 0 && (
          <FilterOption
            className="hidden lg:block"
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onApplyFilters={handleApplyFilters}
          />
        )}

        {/* Main area */}
        <div className="flex-1 w-full">
          {/* Mobile filters */}
          {products.length > 0 && (
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-left flex items-center justify-between"
              >
                <span className="font-medium">Filters & Sort</span>
                <svg
                  className={`w-5 h-5 transform transition-transform ${showMobileFilters ? "rotate-180" : ""}`}
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
          )}

          {/* Toolbar with Grid/List toggle */}
          {products.length > 0 && (
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
              view={view}
              onViewChange={setView}
            />
          )}

          {/* Top pagination */}
          {products.length > 0 && (
            <div className="mb-4">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}

          {isLoading && <Loading message="Loading products..." />}
          {error && <ErrorMessage message={error} />}

          {!isLoading && !error && products.length === 0 && (
            <div className="text-gray-500 py-8 text-center">
              No products found for this category.
            </div>
          )}

          {/* Actual products: switch Grid/List */}
          {!isLoading &&
            !error &&
            products.length > 0 &&
            (view === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {products.map((product) => (
                  <ListProduct
                    key={product.id}
                    product={product}
                    listType="grid"
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="divide-y divide-gray-200 md:divide-y-0">
                  {products.map((product) => (
                    <ListProduct
                      key={product.id}
                      product={product}
                      listType="list"
                    />
                  ))}
                </div>
              </div>
            ))}

          {/* Bottom pagination */}
          {products.length > 0 && (
            <div className="mt-6">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
