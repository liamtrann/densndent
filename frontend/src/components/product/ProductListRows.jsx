import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "store/slices/cartSlice";

import { Button, ProductImage, InputField, DeliveryEstimate } from "common";
import { formatCurrency, extractBuyGet } from "config/config";

import { CURRENT_IN_STOCK, OUT_OF_STOCK } from "@/constants/constant";

/** One product per row with responsive (mobile vs desktop) layouts */
export default function ProductListRows({ products = [] }) {
  const dispatch = useDispatch();

  // qty state per product id
  const [qty, setQty] = useState({});
  useEffect(() => {
    setQty(Object.fromEntries(products.map((p) => [p.id, 1])));
  }, [products]);

  const setQ = (id, n) =>
    setQty((s) => ({ ...s, [id]: Math.max(1, Number(n) || 1) }));

  const add = (p) => {
    const count = qty[p.id] || 1;
    dispatch(addToCart({ ...p, quantity: count }));
  };

  // Small aligned qty control (shared by both views)
  const QtyControl = ({ id }) => (
    <div className="inline-flex items-stretch h-8 rounded border overflow-hidden">
      <button
        className="inline-flex items-center justify-center w-8 h-8 text-sm hover:bg-gray-50 disabled:opacity-50"
        onClick={() => setQ(id, (qty[id] || 1) - 1)}
        disabled={(qty[id] || 1) <= 1}
        aria-label="Decrease quantity"
      >
        –
      </button>

      <InputField
        type="number"
        min="1"
        value={qty[id] || 1}
        onChange={(e) => setQ(id, e.target.value)}
        wrapperClassName="mb-0"
        variant="unstyled"
        size="sm"
        align="center"
        className="h-8 w-14 px-2 appearance-none leading-none border-0 focus:ring-0 focus:outline-none text-sm"
      />

      <button
        className="inline-flex items-center justify-center w-8 h-8 text-sm hover:bg-gray-50"
        onClick={() => setQ(id, (qty[id] || 1) + 1)}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );

  return (
    <div className="divide-y border rounded">
      {products.map((p) => {
        const inStock = Number(p.totalquantityonhand) > 0;
        const { buy, get } = extractBuyGet(p.stockdescription || "");
        const hasPromo = !!(buy && get);

        const Name = (
          <Link
            to={`/product/${p.id}`}
            className="text-base font-medium text-gray-900 hover:underline"
            title={p.itemid || p.displayname}
          >
            {p.itemid || p.displayname}
          </Link>
        );

        const Badges = (
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {inStock ? (
              <div className="flex flex-col gap-1">
                <span className="text-smiles-blue bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-xs font-medium">
                  {CURRENT_IN_STOCK}
                </span>
                <DeliveryEstimate
                  inStock={true}
                  size="small"
                  className="rounded"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <span className="text-smiles-orange bg-orange-50 border border-orange-200 px-2 py-0.5 rounded text-xs font-medium">
                  {OUT_OF_STOCK}
                </span>
                <DeliveryEstimate
                  inStock={false}
                  size="small"
                  className="rounded"
                />
              </div>
            )}
            {hasPromo && (
              <span className="text-smiles-blue bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-xs font-semibold">
                BUY {buy} GET {get}
              </span>
            )}
          </div>
        );

        const ShortDesc = p.storedetaileddescription ? (
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
        ) : null;

        const Price = (
          <div className="text-lg md:text-xl font-bold text-gray-900">
            {p.price != null ? formatCurrency(p.price) : "—"}
          </div>
        );

        return (
          <div key={p.id} className="p-4">
            {/* ---------- Mobile layout (stacked) ---------- */}
            <div className="md:hidden">
              <div className="grid grid-cols-[5rem,1fr] gap-3">
                {/* image */}
                <div className="col-span-1">
                  <Link
                    to={`/product/${p.id}`}
                    title={p.itemid || p.displayname}
                  >
                    <ProductImage
                      src={p.file_url}
                      alt={p.itemid || p.displayname}
                      className="w-20 h-20 object-contain border rounded"
                    />
                  </Link>
                </div>

                {/* name + badges */}
                <div className="col-span-1">
                  {Name}
                  {Badges}
                  {ShortDesc}
                </div>

                {/* price + qty */}
                <div className="col-span-2 mt-1 flex items-center justify-between">
                  {Price}
                  <QtyControl id={p.id} />
                </div>

                {/* button */}
                <div className="col-span-2">
                  <Button
                    onClick={() => add(p)}
                    className="w-full h-9 text-sm"
                    title="Add to Cart"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>

            {/* ---------- Desktop / Tablet layout ---------- */}
            <div className="hidden md:flex md:flex-row items-center gap-4">
              {/* image */}
              <div className="w-24 shrink-0">
                <Link to={`/product/${p.id}`} title={p.itemid || p.displayname}>
                  <ProductImage
                    src={p.file_url}
                    alt={p.itemid || p.displayname}
                    className="w-24 h-24 object-contain border rounded"
                  />
                </Link>
              </div>

              {/* name + badges + optional desc */}
              <div className="flex-1 min-w-0">
                {Name}
                {Badges}
                {ShortDesc}
              </div>

              {/* price */}
              <div className="md:w-32">{Price}</div>

              {/* qty */}
              <QtyControl id={p.id} />

              {/* add to cart */}
              <div className="md:w-40">
                <Button
                  onClick={() => add(p)}
                  className="w-full h-8 px-3 py-0 text-sm rounded-md"
                  title="Add to Cart"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
