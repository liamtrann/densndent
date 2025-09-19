import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsBy } from "store/slices/productsSlice";

import { ErrorMessage, Loading, ProductToolbar } from "common";

import { ListProduct } from "..";

export default function ListProductNoFilter({ searchIds, by }) {
  const [view, setView] = useState("grid");
  const hasFetched = useRef(false);

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
    // Return early if no 'by' prop provided or already fetched
    if (!by || !searchIds || hasFetched.current) {
      return;
    }

    // Mark as fetched to prevent re-calls
    hasFetched.current = true;

    // Load products
    const fetchConfig = {
      type: by,
      id: processedSearchIds,
      sort: "",
      minPrice: "",
      maxPrice: "",
    };

    // Add auth token for user-specific data
    if (by === "orderHistory" || by === "favoriteItems") {
      fetchConfig.getAccessTokenSilently = getAccessTokenSilently;
    }

    dispatch(fetchProductsBy(fetchConfig));
  }, [dispatch, processedSearchIds, searchIds, by, getAccessTokenSilently]);

  // Reset fetch flag when key parameters change
  useEffect(() => {
    hasFetched.current = false;
  }, [processedSearchIds, by]);

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
      </main>
    </div>
  );
}
