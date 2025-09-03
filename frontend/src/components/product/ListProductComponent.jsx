import React, { useEffect, useState } from "react"; //useState for local UI state. useEffect to run code when inputs change (e.g., fetch data).
import { useDispatch, useSelector } from "react-redux"; //useDispatch lets the component send actions to the Redux store. useSelector lets it read values from the Redux store
import { fetchProductsBy, fetchCountBy } from "store/slices/productsSlice"; //gfetchProductsBy → get one page of products. fetchCountBy → get the total count (needed to know how many pages exist)

import { delayCall } from "api/util"; //delayCall is a small debouncer/throttle helper (prevents firing requests too fast)
import {
  Breadcrumb,
  ErrorMessage,
  Loading,
  Pagination,
  ProductToolbar,
} from "common";

import FilterOption from "../filters/FilterOption";
import ListRows from "./ListRows";
import ListGrids from "./ListGrids";

export default function ListProductComponent({
  type, // how to query (e.g., by brand/class/category/name/all).
  id, //the id or text for the query (or null for “all”).
  breadcrumbPath, // array of breadcrumb labels.
  headerTitle //big title at the top.
}) {
  const [perPage, setPerPage] = useState(12); //number of products per page (defaults to 12)
  const [sort, setSort] = useState(""); //current sort choice (empty string means “default” sort)
  const [page, setPage] = useState(1);



  const [view, setView] = useState("grid"); //GRID -----------<



  const [showMobileFilters, setShowMobileFilters] = useState(false); //whether the mobile filter panel is open.
  const [appliedFilters, setAppliedFilters] = useState({
    minPrice: "",
    maxPrice: "",
    selectedCategories: [],
    selectedBrands: [], //filters that are actually applied to the query right now
  });
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    selectedCategories: [],
    selectedBrands: [], //filters the user is currently editing in the sidebar/panel (not applied yet)
  });



  //Cache keys (so you don’t refetch the same page)
  const dispatch = useDispatch(); //use this to fire the thunks
  const priceKey = `${appliedFilters.minPrice || ""}_${appliedFilters.maxPrice || ""}`; //builds a small string representing the current price range (used in cache keys).
  const effectiveId = id || "all"; //if no id was passed, treat it as “all
  const key = `${effectiveId}_${perPage}_${sort}_${priceKey}_${page}`; //key identifies the exact product page for the current query
  const countKey = `${effectiveId}_${priceKey}`; //countKey identifies the total count result for the current id + price range.




  //the component reads data from Redux using useSelector:
  const products = useSelector(
    (state) => state.products.productsByPage[key] || []
  );



  const isLoading = useSelector((state) => state.products.isLoading);
  const error = useSelector((state) => state.products.error);
  const total = useSelector((state) => { //look up the total product count for the current countKey
    const count = state.products.totalCounts?.[countKey];
    return count !== undefined ? count : 0;
  });
 




  //if that page isn’t cached yet, the useEffect hooks dispatch fetchCountBy and fetchProductsBy to load them, and the component re-renders when the store updates
  useEffect(() => {
    setPage(1); //reset page + sort because you’re looking at a new query context
    setSort("");
    if (id || type === "all") { //if there is a target (id or “all”), request the total count for that context
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

  // filtered count (if price filters are applied):
  useEffect(() => {
    if (
      (id || type === "all") &&
      (appliedFilters.minPrice || appliedFilters.maxPrice) //only runs when a min or max price is actually applied
    ) {




      return delayCall(() =>
        dispatch(
          fetchCountBy({
            type,
            id: effectiveId === "all" ? null : effectiveId,
            minPrice: appliedFilters.minPrice,
            maxPrice: appliedFilters.maxPrice, //updates the total count for that price window.
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

  // product page fetch (the actual list of items):
  useEffect(() => {
    if (id || type === "all") {
      if (!products || products.length === 0) { //when any of the query inputs (page, perPage, sort, price filters) change. if no cached data for the new key (products.length === 0), fetch it. if the cache already has this page, nothing happens (fast!)
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

  const totalPages = Math.ceil(total / perPage) || 1; //how many pages should the pagination show (at least 1)

  const handleFiltersChange = (newFilters) => setFilters(newFilters); //updates the editing filters from the sidebar.

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPage(1);

    if (filters.minPrice || filters.maxPrice) {
      dispatch(
        fetchCountBy({
          type,
          id: effectiveId === "all" ? null : effectiveId, //if a price filter is involved, refresh the count right away
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
              onViewChange={setView} // ← GRID/LIST toggle flows through here
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
            (view === "grid" ? ( //If view === "grid" → render <ListGrids products={products} /> Else → render <ListRows products={products} />
              <ListGrids products={products} /> //grid maps each product into ProductInListGrid tiles (image, name, price, stock, quick look, add to cart).
            ) : (
              <ListRows products={products} />
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
