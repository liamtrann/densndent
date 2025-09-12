import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsBy } from "store/slices/productsSlice";

import { delayCall } from "api/util";
import { ErrorMessage, Loading, Pagination, ProductToolbar } from "common";

import ProductListGrid from "./ListGrids";
import ProductListRows from "./ListRows";

export default function ListProductNoFilter({ searchIds, by }) {
  const [perPage, setPerPage] = useState(12);
  const [page, setPage] = useState(1);
  const [view, setView] = useState("grid");

  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();

  // Convert searchIds string to array for favoriteItems
  const processedSearchIds =
    by === "favoriteItems" && searchIds
      ? searchIds
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id !== "")
          .map((id) => Number(id))
          .filter((id) => !isNaN(id))
      : searchIds;

  // Key structure must match what productsSlice expects
  const sort = ""; // No sorting for order history
  const minPrice = "";
  const maxPrice = "";
  const priceKey = `${minPrice}_${maxPrice}`;
  const key = `${processedSearchIds}_${perPage}_${sort}_${priceKey}_${page}`;

  const products = useSelector(
    (state) => state.products.productsByPage[key] || []
  );
  const isLoading = useSelector((state) => state.products.isLoading);
  const error = useSelector((state) => state.products.error);

  useEffect(() => {
    // Return early if no 'by' prop provided
    if (!by) {
      return;
    }

    if (searchIds && products.length === 0 && !isLoading) {
      return delayCall(() => {
        const fetchConfig = {
          id: processedSearchIds,
          page,
          limit: perPage,
          sort: "",
          minPrice: "",
          maxPrice: "",
        };

        // Add auth token for user-specific data
        if (by === "orderHistory" || by === "favoriteItems") {
          fetchConfig.getAccessTokenSilently = getAccessTokenSilently;
        }

        dispatch(
          fetchProductsBy({
            type: by,
            ...fetchConfig,
          })
        );
      });
    }
  }, [
    dispatch,
    processedSearchIds,
    searchIds,
    perPage,
    page,
    getAccessTokenSilently,
    products.length,
    by,
    isLoading,
  ]);

  // Calculate total pages - assuming we get total from API response
  // For now, we'll show pagination based on current products
  const hasNextPage = products.length === perPage;
  const totalPages = hasNextPage ? page + 1 : page;

  return (
    <div className="px-6 py-8 max-w-screen-xl mx-auto">
      <main>
        {/* Simple pagination controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Page {page} {hasNextPage && `of ${totalPages}+`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!hasNextPage}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

        {/* Products display */}
        {isLoading && (
          <Loading
            message={`Loading your ${by.replace(/([A-Z])/g, " $1").toLowerCase()}...`}
          />
        )}
        {error && (
          <ErrorMessage
            message={`Failed to load ${by.replace(/([A-Z])/g, " $1").toLowerCase()}. Please try again later.`}
          />
        )}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-gray-500 py-8 text-center">
            No products found in your{" "}
            {by.replace(/([A-Z])/g, " $1").toLowerCase()}.
          </div>
        )}

        {/* Toolbar with Grid/List toggle */}
        {!isLoading && !error && products.length > 0 && (
          <ProductToolbar
            perPageOptions={[12, 24, 48]}
            onPerPageChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            perPage={perPage}
            sort=""
            onSortChange={() => {}} // No sorting for order history
            total={products.length}
            view={view}
            onViewChange={setView}
            showSort={false}
            showPerPage={false}
          />
        )}

        {/* Products display with view toggle */}
        {!isLoading &&
          !error &&
          products.length > 0 &&
          (view === "grid" ? (
            <ProductListGrid products={products} />
          ) : (
            <ProductListRows products={products} />
          ))}

        {/* Bottom pagination */}
        {!isLoading && !error && products.length > 0 && (
          <div className="flex justify-center mt-8">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </main>
    </div>
  );
}
