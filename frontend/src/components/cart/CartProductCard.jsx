import React from "react";
import { InputField, ProductImage } from "common";
import { formatCurrency, calculateTotalCurrency } from "config/config";

export default function CartProductCard({
  item,
  inv,
  onNavigate,
  onQuantityChange,
  onRemove,
}) {
  const outOfStock = inv && inv.quantityavailable <= 0;
  const missing = !inv;
  return (
    <div
      key={item.id + (item.flavor ? `-${item.flavor}` : "")}
      className={`flex gap-6 border p-4 rounded-md shadow-sm mb-4 ${
        outOfStock ? "bg-red-50" : ""
      }`}
    >
      <span className="cursor-pointer" onClick={() => onNavigate(item.id)}>
        <ProductImage
          src={item.file_url}
          alt={item.itemid || item.displayname || "Product"}
          className="h-32"
        />
      </span>
      <div className="flex-grow">
        <h2
          className="font-semibold mb-1 cursor-pointer hover:underline"
          onClick={() => onNavigate(item.id)}
        >
          {item.itemid || item.displayname}
        </h2>
        <p className="text-gray-600">
          {formatCurrency(item.unitprice || item.price)}
        </p>
        {typeof item.totalquantityonhand !== "undefined" && (
          <p
            className={
              item.totalquantityonhand > 0
                ? "text-green-700 font-semibold text-sm mb-1"
                : "text-red-600 font-semibold text-sm mb-1"
            }
          >
            {item.totalquantityonhand > 0
              ? `Current Stock: ${item.totalquantityonhand}`
              : "Out of stock"}
          </p>
        )}
        {/* Inventory check warning */}
        {inv && inv.quantityavailable <= 0 && (
          <div className="flex items-center gap-2 bg-red-100 border border-red-400 rounded px-2 py-1 my-1">
            <span className="text-red-700 font-bold text-lg">&#9888;</span>
            <p className="text-red-700 font-semibold text-xs">
              This item is out of stock.
            </p>
          </div>
        )}
        {missing && (
          <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-400 rounded px-2 py-1 my-1">
            <span className="text-yellow-700 font-bold text-lg">&#9888;</span>
            <span className="text-yellow-800 font-semibold text-xs">
              This item is no longer available or has been removed from
              inventory.
            </span>
          </div>
        )}
        <div className="mt-2 w-24">
          <InputField
            label="Quantity:"
            type="number"
            min={1}
            max={item.totalquantityonhand || 9999}
            value={item.quantity}
            onChange={(e) => onQuantityChange(item, e.target.value)}
          />
        </div>
        <p className="mt-2 text-sm">
          <span className="font-medium">Amount:</span>{" "}
          <span className="font-bold">
            {calculateTotalCurrency(
              item.unitprice || item.price,
              item.quantity
            )}
          </span>
        </p>
        <button
          className="mt-2 text-red-600 underline text-sm"
          onClick={() => onRemove(item)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
