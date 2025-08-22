import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button, ProductImage, InputField } from "common";
import { addToCart } from "store/slices/cartSlice";
import { formatCurrency } from "config/config";

/** One product per row: image | name+desc | price | qty | add */
export default function ProductListRows({ products = [] }) {
  const dispatch = useDispatch();

  const [qty, setQty] = useState(() =>
    Object.fromEntries(products.map((p) => [p.id, 1]))
  );

  const setQ = (id, n) =>
    setQty((s) => ({ ...s, [id]: Math.max(1, Number(n) || 1) }));

  const add = (p) => {
    dispatch(addToCart({ ...p, quantity: qty[p.id] || 1 }));
  };

  return (
    <div className="divide-y border rounded">
      {products.map((p) => (
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

          {/* Name + short description */}
          <div className="flex-1 min-w-0">
            <Link
              to={`/product/${p.id}`}
              className="text-base font-semibold text-gray-900 hover:underline"
              title={p.itemid || p.displayname}
            >
              {p.itemid || p.displayname}
            </Link>

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

          {/* Price */}
          <div className="md:w-28 font-semibold text-gray-900">
            {p.price != null ? formatCurrency(p.price) : "--"}
          </div>

          {/* Qty */}
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setQ(p.id, (qty[p.id] || 1) - 1)}
              disabled={(qty[p.id] || 1) <= 1}
            >
              –
            </button>
            <InputField
              type="number"
              min="1"
              value={qty[p.id] || 1}
              onChange={(e) => setQ(p.id, e.target.value)}
              className="w-16 text-center"
            />
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setQ(p.id, (qty[p.id] || 1) + 1)}
            >
              +
            </button>
          </div>

          {/* Add to cart */}
          <div className="md:w-40">
            <Button onClick={() => add(p)} className="w-full">
              Add to Cart
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
