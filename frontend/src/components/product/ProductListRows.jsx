import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, ProductImage, InputField } from "common";
import { addToCart } from "store/slices/cartSlice";
import { formatCurrency, extractBuyGet } from "config/config";

/** One product per row: image | name+badges | price | qty | add */
export default function ProductListRows({ products = [] }) {
  const dispatch = useDispatch();

  // qty state per product id
  const [qty, setQty] = useState({});
  useEffect(() => {
    setQty(Object.fromEntries((products || []).map((p) => [p.id, 1])));
  }, [products]);

  const setQ = (id, n) =>
    setQty((s) => ({ ...s, [id]: Math.max(1, Number(n) || 1) }));

  const add = (p) => {
    const count = qty[p.id] || 1;
    dispatch(addToCart({ ...p, quantity: count }));
  };

  return (
    <div className="divide-y border rounded">
      {(products || []).map((p) => {
        const inStock = Number(p.totalquantityonhand) > 0;
        const { buy, get } = extractBuyGet(p.stockdescription || "");
        const hasPromo = !!(buy && get);

        return (
          <div
            key={p.id}
            className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4"
          >
            {/* Image */}
            <div className="w-24 shrink-0">
              <Link to={`/product/${p.id}`} title={p.itemid || p.displayname}>
                <ProductImage
                  src={p.file_url}
                  alt={p.itemid || p.displayname}
                  className="w-24 h-24 object-contain border rounded"
                />
              </Link>
            </div>

            {/* Name + badges */}
            <div className="flex-1 min-w-0">
              <Link
                to={`/product/${p.id}`}
                className="text-base font text-gray-900 hover:underline"
                title={p.itemid || p.displayname}
              >
                {p.itemid || p.displayname}
              </Link>

              {/* Badges */}
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {inStock ? (
                  <span className="text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded text-xs font-medium">
                    Current Stock
                  </span>
                ) : (
                  <span className="text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-xs font-medium">
                    Out of stock
                  </span>
                )}
                {hasPromo && (
                  <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-xs font-semibold">
                    BUY {buy} GET {get}
                  </span>
                )}
              </div>

              {/* Optional short description */}
              {p.storedetaileddescription ? (
                <div
                  className="mt-1 text-sm text-gray-600 line-clamp-2"
                  title={p.storedetaileddescription.replace(/<[^>]*>/g, "")}
                  dangerouslySetInnerHTML={{
                    __html: p.storedetaileddescription,
                  }}
                />
              ) : p.displayname ? (
                <div className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {p.displayname}
                </div>
              ) : null}
            </div>

            {/* Price — bold but compact */}
            <div className="md:w-28 text-base md:text-lg font-bold text-gray-900">
              {p.price != null ? formatCurrency(p.price) : "—"}
            </div>

            {/* Qty — uniform height, perfectly aligned */}
            <div className="flex items-center gap-1 md:w-36">
              <button
                className="h-8 w-8 border rounded inline-flex items-center justify-center text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setQ(p.id, (qty[p.id] || 1) - 1)}
                disabled={(qty[p.id] || 1) <= 1}
                aria-label="Decrease quantity"
              >
                –
              </button>
              <InputField
                bare
                type="number"
                min="1"
                value={qty[p.id] || 1}
                onChange={(e) => setQ(p.id, e.target.value)}
                className="h-8 w-14 text-center text-sm border rounded"
                aria-label="Quantity"
              />
              <button
                className="h-8 w-8 border rounded inline-flex items-center justify-center text-sm hover:bg-gray-50"
                onClick={() => setQ(p.id, (qty[p.id] || 1) + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Add to cart — compact */}
            <div className="md:w-40">
              <Button
                onClick={() => add(p)}
                className="w-full px-3 py-1.5 text-xs rounded-md"
                disabled={!inStock}
                title={inStock ? "Add to Cart" : "Out of stock"}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
