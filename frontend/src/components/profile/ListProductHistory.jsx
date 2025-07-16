import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { delayCall } from "api/util";
import { fetchProductsBy } from "../../redux/slices/productsSlice";
import { ErrorMessage, Loading, Pagination } from "common";
import ProductListGrid from "../product/ProductListGrid";

export default function ListProductHistory({ userId }) {
  const [perPage, setPerPage] = useState(12);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const key = `${userId}_${perPage}_undefined_${page}`;
  const products = useSelector(
    (state) => state.products.productsByPage[key] || []
  );
  const isLoading = useSelector((state) => state.products.isLoading);
  const error = useSelector((state) => state.products.error);

  useEffect(() => {
    if (userId && products.length === 0 && !isLoading) {
      return delayCall(() => {
        dispatch(
          fetchProductsBy({
            type: "orderHistory",
            id: userId,
            page,
            limit: perPage,
            getAccessTokenSilently,
          })
        );
      });
    }
  }, [
    dispatch,
    userId,
    perPage,
    page,
    getAccessTokenSilently,
    products.length,
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
        {isLoading && <Loading message="Loading your order history..." />}
        {error && (
          <ErrorMessage message="Failed to load order history. Please try again later." />
        )}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-gray-500 py-8 text-center">
            No products found in your order history.
          </div>
        )}
        {!isLoading && !error && products.length > 0 && (
          <ProductListGrid products={products} />
        )}

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
