import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../common/Breadcrumb";
import FilterSidebar from "../components/FilterSidebar";
import ProductToolbar from "../common/ProductToolbar";
import ProductListGrid from "../components/ProductListGrid";
import { fetchProductsByClass, fetchCountByClass } from "../redux/slices/productsSlice";
import Loading from "../common/Loading";

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

  const dispatch = useDispatch();
  const { products = [], status, error } = useSelector(
    (state) => state.products.byClassId?.[classId + "_" + perPage + "_" + sort] || { products: [], status: "idle", error: null }
  );
  const total = useSelector(state => state.products.totalByClass?.[classId] || 0);

  useEffect(() => {
    if (classId) {
      dispatch(fetchProductsByClass({ classId, page: 1, limit: perPage, sort }));
      dispatch(fetchCountByClass(classId));
    }
  }, [dispatch, classId, perPage, sort]);

  console.log(total)

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
            onPerPageChange={e => setPerPage(Number(e.target.value))}
            perPage={perPage}
            sort={sort}
            onSortChange={e => setSort(e.target.value)}
            total={total}
          />
          {status === "loading" && <Loading message="Loading products..." />}
          {status === "failed" && (
            <div className="text-red-500 py-8 text-center">
              {error || "Failed to load products."}
            </div>
          )}
          {status === "succeeded" && products.length === 0 && (
            <div className="text-gray-500 py-8 text-center">
              No products found for this category.
            </div>
          )}
          {status === "succeeded" && products.length > 0 && (
            <ProductListGrid products={products} />
          )}
        </main>
      </div>
    </div>
  );
}
