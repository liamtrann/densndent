import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../common/Breadcrumb";
import FilterSidebar from "../components/FilterSidebar";
import ProductToolbar from "../common/ProductToolbar";
import ProductListGrid from "../components/ProductListGrid";
import { fetchProductsByClass, fetchCountByClass } from "../redux/slices/productsSlice";
import Loading from "../common/Loading";
import Pagination from "../common/Pagination";
import ErrorMessage from "../common/ErrorMessage";

export default function ListProductPage() {
  const { name: nameAndId } = useParams();
  let name = "";
  let classId = "";
  if (nameAndId) {
    const lastDash = nameAndId.lastIndexOf("-");
    if (lastDash !== -1) {
      name = nameAndId.slice(0, lastDash);
      classId = nameAndId.slice(lastDash + 1);
    } else {
      name = nameAndId;
    }
  }

  const [perPage, setPerPage] = useState(12);
  const [sort, setSort] = useState("price-asc");
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  // Use productsByPage and key `${classId}_${perPage}_${sort}_${page}`
  const key = `${classId}_${perPage}_${sort}_${page}`;
  const products = useSelector(state => state.products.productsByPage[key] || []);
  const isLoading = useSelector(state => state.products.isLoading);
  const error = useSelector(state => state.products.error);
  const total = useSelector(state => state.products.totalByClass?.[classId] || 0);

  useEffect(() => {
    setPage(1);
    if (classId) {
      dispatch(fetchCountByClass(classId));
    }
  }, [dispatch, classId]);

  // Fetch products when classId, perPage, sort, or page changes
  useEffect(() => {
    if (classId) {
      if (!products || products.length === 0) {
        const timeout = setTimeout(() => {
          dispatch(fetchProductsByClass({ classId, page, limit: perPage, sort }));
        }, 50);
        return () => clearTimeout(timeout);
      }
    }
  }, [dispatch, classId, perPage, sort, page, products.length]);

  const totalPages = Math.ceil(total / perPage) || 1;

  console.log(products)

  return (
    <div className="px-6 py-8 max-w-screen-xl mx-auto">
      <Breadcrumb path={["Home", "Products", name]} />
      <h1 className="text-3xl font-bold text-smiles-blue mb-6">
        {name.toUpperCase()}
      </h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <FilterSidebar />
        <main className="flex-1">
          <ProductToolbar
            perPageOptions={[12, 24, 48]}
            onPerPageChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
            perPage={perPage}
            sort={sort}
            onSortChange={e => setSort(e.target.value)}
            total={total}
          />
          {/* Pagination Controls */}
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          {isLoading && <Loading message="Loading products..." />}
          {error && (
            <ErrorMessage message={error} />
          )}
          {!isLoading && !error && products.length === 0 && (
            <div className="text-gray-500 py-8 text-center">
              No products found for this category.
            </div>
          )}
          {!isLoading && !error && products.length > 0 && (
            <ProductListGrid products={products} />
          )}
        </main>
      </div>
    </div>
  );
}
