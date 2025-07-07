import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumb from "../common/Breadcrumb";
import FilterSidebar from "../components/FilterSidebar";
import ProductToolbar from "../common/ProductToolbar";
import ProductListGrid from "../components/ProductListGrid";
import { fetchProductsBy, fetchCountBy } from "../redux/slices/productsSlice";
import Loading from "../common/Loading";
import Pagination from "../common/Pagination";
import ErrorMessage from "../common/ErrorMessage";
import { delayCall } from "../api/util";

export default function ListProductsByBrandPage() {
    const { brandName: brandNameParam } = useParams();
    const brandName = brandNameParam || "";

    const [perPage, setPerPage] = useState(12);
    const [sort, setSort] = useState(null);
    const [page, setPage] = useState(1);

    const dispatch = useDispatch();
    const key = `${brandName}_${perPage}_${sort}_${page}`;
    const products = useSelector(state => state.products.productsByPage[key] || []);
    const isLoading = useSelector(state => state.products.isLoading);
    const error = useSelector(state => state.products.error);
    const total = useSelector(state => state.products.totalByClass?.[brandName] || 0);

    useEffect(() => {
        setPage(1);
        setSort("")
        if (brandName) {
            return delayCall(() => dispatch(fetchCountBy({ type: "brand", id: brandName })));
        }
    }, [dispatch, brandName]);

    // Fetch products when classId, perPage, sort, or page changes
    useEffect(() => {
        if (brandName) {
            if (!products || products.length === 0) {
                return delayCall(() => {
                    dispatch(fetchProductsBy({ type: "brand", id: brandName, page, limit: perPage, sort }));
                });
            }
        }
    }, [dispatch, brandName, perPage, sort, page, products.length]);

    const totalPages = Math.ceil(total / perPage) || 1;

    console.log(products)

    return (
        <div className="px-6 py-8 max-w-screen-xl mx-auto">
            <Breadcrumb path={["Home", "Products", brandName]} />
            <h1 className="text-3xl font-bold text-smiles-blue mb-6">
                {brandName.toUpperCase()}
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