import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsBy } from "store/slices/productsSlice";

import { delayCall } from "api/util";
import { ErrorMessage, Loading, ProductToolbar } from "common";

import ProductListGrid from "./ListGrids";
import ProductListRows from "./ListRows";

export default function ListProductNoFilter({ searchIds, by }) {
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

  // Key structure simplified - no pagination for favorites/orderHistory
  const sort = ""; // No sorting for order history
  const minPrice = "";
  const maxPrice = "";
  const priceKey = `${minPrice}_${maxPrice}`;
  const key = `${processedSearchIds}_${sort}_${priceKey}`;

  const products = useSelector(
    (state) => state.products.productsByPage[key] || []
  );
  const isLoading = useSelector((state) => state.products.isLoading);
  const error = useSelector((state) => state.products.error);

  useEffect(() => {
    // Return early if no 'by' prop provided
    if (!by || !searchIds) {
      return;
    }

    // Load all products when needed
    if (!isLoading && products.length === 0) {
      return delayCall(() => {
        const fetchConfig = {
          type: by,
          id: processedSearchIds,
          sort: "",
          minPrice: "",
          maxPrice: "",
          getAccessTokenSilently,
        };

        // Add auth token for user-specific data
        if (by === "orderHistory" || by === "favoriteItems") {
          fetchConfig.getAccessTokenSilently = getAccessTokenSilently;
        }

        dispatch(fetchProductsBy(fetchConfig));
      });
    }
  }, [
    dispatch,
    processedSearchIds,
    searchIds,
    getAccessTokenSilently,
    by,
    isLoading,
    products.length,
  ]);

  return (
    <div className="px-6 py-8 max-w-screen-xl mx-auto">
      <main>
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

        {/* Toolbar with Grid/List toggle only */}
        {!isLoading && !error && products.length > 0 && (
          <div className="mb-4">
            <ProductToolbar
              perPageOptions={[12, 24, 48]}
              onPerPageChange={() => {}} // No per page change needed
              perPage={12} // Static value
              sort=""
              onSortChange={() => {}} // No sorting for order history
              total={products.length}
              view={view}
              onViewChange={setView}
              showSort={false}
              showPerPage={false}
            />
          </div>
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
      </main>
    </div>
  );
}
