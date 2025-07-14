import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { delayCall } from "../api/util";
import { fetchProductsBy, fetchCountBy } from "../redux/slices/productsSlice";
import { Breadcrumb, ErrorMessage, Loading, Pagination, ProductToolbar } from "../common";
import FilterSidebar from "./FilterSidebar";
import ProductListGrid from "./ProductListGrid";
import CartSummaryPanel from "./CartSummaryPanel"; // 👈 Import here
export default function ListProductComponent({
  type,
  id,
  breadcrumbPath,
  headerTitle
}) {
  const [perPage, setPerPage] = useState(12);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const key = `${id}_${perPage}_${sort}_${page}`;
  const products = useSelector(state => state.products.productsByPage[key] || []);
  const isLoading = useSelector(state => state.products.isLoading);
  const error = useSelector(state => state.products.error);
  // Use either totalByClass or totalByBrand, fallback to totalByClass
  const total = useSelector(state => (
    state.products.totalByClass?.[id] || state.products.totalByBrand?.[id] || 0
  ));

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


return (
  <div className="px-6 py-8 max-w-screen-2xl mx-auto">
    <Breadcrumb path={breadcrumbPath} />
    <h1 className="text-3xl font-bold text-smiles-blue mb-6">
      {headerTitle}
    </h1>

    {/* 3-column layout here */}
    <div className="flex gap-6 items-start">
      {/* Left Column: Filters */}
      <div className="w-[240px] shrink-0">
        <FilterSidebar />
      </div>

      {/* Center Column: Main product area */}
      <div className="flex-1">
        <ProductToolbar
          perPageOptions={[12, 24, 48]}
          onPerPageChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
          perPage={perPage}
          sort={sort}
          onSortChange={e => setSort(e.target.value)}
          total={total}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
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
      </div>

      {/* Right Column: Cart summary */}
      <div className="w-[300px] shrink-0">
        <CartSummaryPanel />
      </div>
    </div>
  </div>
);

}