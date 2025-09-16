import React from "react";

import { ProductImage } from "common";
import { formatDeliveryDays } from "config/config";

export default function TableLayout({
  item,
  showQuantityControls = true,
  showTotal = true,
  onItemClick,
  onQuantityChange,
  handleDecrease,
  handleIncrease,
  hasDiscount,
  finalPrice,
  priceData,
  unitPrice,
  calculateTotalCurrency,
  formatCurrency,
}) {
  return (
    <div className="grid grid-cols-12 gap-4 p-3 border-b hover:bg-gray-50 items-center">
      {/* Image Column - 1 unit */}
      <div className="col-span-1">
        <ProductImage
          src={item.file_url || item.img1 || item.imageurl}
          alt={item.itemid || item.displayname}
          className={`w-12 h-12 object-cover border rounded ${
            onItemClick ? "cursor-pointer" : ""
          }`}
          onClick={onItemClick ? () => onItemClick(item.id) : undefined}
        />
      </div>

      {/* Product Name & Details Column - 5 units */}
      <div className="col-span-5">
        <div
          className={`font-medium text-sm mb-1 ${
            onItemClick ? "text-blue-700 hover:underline cursor-pointer" : ""
          }`}
          onClick={onItemClick ? () => onItemClick(item.id) : undefined}
        >
          {item.itemid || item.displayname}
        </div>

        {/* Product badges/tags */}
        <div className="flex flex-wrap gap-1">
          {item.stockdescription && (
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">
              {item.stockdescription}
            </span>
          )}

          {item.subscriptionEnabled && (
            <span className="text-xs text-white font-medium bg-smiles-gentleBlue px-1.5 py-0.5 rounded">
              Every {item.subscriptionInterval} {item.subscriptionUnit}
            </span>
          )}

          {item.subscriptionEnabled &&
            item.subscriptionPreferredDeliveryDays && (
              <span className="text-xs text-orange-700 font-medium bg-orange-50 px-1.5 py-0.5 rounded">
                Prefer:{" "}
                {formatDeliveryDays(item.subscriptionPreferredDeliveryDays)}
              </span>
            )}
        </div>
      </div>

      {/* Unit Price Column - 2 units */}
      <div className="col-span-2 text-center">
        <div className="text-sm font-medium">
          ${Number(item.unitprice || item.price || 0).toFixed(2)}
        </div>
        <div className="text-xs text-gray-500">per unit</div>
      </div>

      {/* Quantity Column - 2 units */}
      <div className="col-span-2 text-center">
        {showQuantityControls && onQuantityChange ? (
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={handleDecrease}
              className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-100 text-sm"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-100 text-sm"
            >
              +
            </button>
          </div>
        ) : (
          <span className="text-sm font-medium">{item.quantity}</span>
        )}
      </div>

      {/* Total Price Column - 2 units */}
      {showTotal && (
        <div className="col-span-2 text-right">
          {hasDiscount ? (
            <div>
              <div className="text-gray-500 line-through text-xs">
                {calculateTotalCurrency(unitPrice, item.quantity)}
              </div>
              <div className="text-red-600 font-semibold text-sm">
                {formatCurrency(finalPrice)}
              </div>
              <div className="text-green-600 text-xs">
                Save {formatCurrency(priceData?.discount || 0)}
              </div>
            </div>
          ) : (
            <div className="text-gray-800 font-semibold text-sm">
              {formatCurrency(finalPrice)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
