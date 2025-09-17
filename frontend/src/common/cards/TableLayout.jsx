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
    <>
      {/* Mobile Layout - Stack vertically */}
      <div className="block md:hidden p-3 border-b hover:bg-gray-50">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <ProductImage
              src={item.file_url || item.img1 || item.imageurl}
              alt={item.itemid || item.displayname}
              className={`w-20 h-20 object-cover border rounded ${
                onItemClick ? "cursor-pointer" : ""
              }`}
              onClick={onItemClick ? () => onItemClick(item.id) : undefined}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div
              className={`font-medium text-sm mb-2 line-clamp-2 ${
                onItemClick
                  ? "text-blue-700 hover:underline cursor-pointer"
                  : ""
              }`}
              onClick={onItemClick ? () => onItemClick(item.id) : undefined}
            >
              {item.itemid || item.displayname}
            </div>

            {/* Product badges/tags */}
            <div className="flex flex-wrap gap-1 mb-2">
              {item.stockdescription && (
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-1 py-0.5 rounded">
                  {item.stockdescription}
                </span>
              )}

              {item.subscriptionEnabled && (
                <span className="text-xs text-white font-medium bg-smiles-gentleBlue px-1 py-0.5 rounded">
                  Every {item.subscriptionInterval} {item.subscriptionUnit}
                </span>
              )}

              {item.subscriptionEnabled &&
                item.subscriptionPreferredDeliveryDays && (
                  <span className="text-xs text-orange-700 font-medium bg-orange-50 px-1 py-0.5 rounded">
                    Prefer:{" "}
                    {formatDeliveryDays(item.subscriptionPreferredDeliveryDays)}
                  </span>
                )}
            </div>

            {/* Mobile Price and Quantity Row */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="text-xs text-gray-500 mb-1">
                  ${Number(item.unitprice || item.price || 0).toFixed(2)} each
                </div>
                {showTotal && (
                  <div>
                    {hasDiscount ? (
                      <div>
                        <div className="text-gray-500 line-through text-xs">
                          {calculateTotalCurrency(unitPrice, item.quantity)}
                        </div>
                        <div className="text-red-600 font-semibold text-xs">
                          {formatCurrency(finalPrice)}
                        </div>
                        <div className="text-green-600 text-xs">
                          Save {formatCurrency(priceData?.discount || 0)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-800 font-semibold text-xs">
                        {formatCurrency(finalPrice)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Quantity Controls */}
              <div className="flex items-center">
                {showQuantityControls && onQuantityChange ? (
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={handleDecrease}
                      className="w-5 h-5 flex items-center justify-center border rounded hover:bg-gray-100 text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-xs font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={handleIncrease}
                      className="w-5 h-5 flex items-center justify-center border rounded hover:bg-gray-100 text-xs"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-medium">
                    Qty: {item.quantity}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Table grid */}
      <div className="hidden md:grid grid-cols-12 gap-2 lg:gap-4 p-3 border-b hover:bg-gray-50 items-center min-w-[800px] overflow-x-auto">
        {/* Image Column - 1 unit */}
        <div className="col-span-1">
          <ProductImage
            src={item.file_url || item.img1 || item.imageurl}
            alt={item.itemid || item.displayname}
            className={`w-16 h-16 lg:w-20 lg:h-20 object-cover border rounded ${
              onItemClick ? "cursor-pointer" : ""
            }`}
            onClick={onItemClick ? () => onItemClick(item.id) : undefined}
          />
        </div>

        {/* Product Name & Details Column - 6 units (increased from 5) */}
        <div className="col-span-6">
          <div
            className={`font-medium text-sm lg:text-base mb-1 ${
              onItemClick ? "text-blue-700 hover:underline cursor-pointer" : ""
            }`}
            onClick={onItemClick ? () => onItemClick(item.id) : undefined}
          >
            {item.itemid || item.displayname}
          </div>

          {/* Product badges/tags */}
          <div className="flex flex-wrap gap-1">
            {item.stockdescription && (
              <span className="text-xs text-blue-600 font-medium bg-blue-50 px-1 py-0.5 rounded">
                {item.stockdescription}
              </span>
            )}

            {item.subscriptionEnabled && (
              <span className="text-xs text-white font-medium bg-smiles-gentleBlue px-1 py-0.5 rounded">
                Every {item.subscriptionInterval} {item.subscriptionUnit}
              </span>
            )}

            {item.subscriptionEnabled &&
              item.subscriptionPreferredDeliveryDays && (
                <span className="text-xs text-orange-700 font-medium bg-orange-50 px-1 py-0.5 rounded">
                  Prefer:{" "}
                  {formatDeliveryDays(item.subscriptionPreferredDeliveryDays)}
                </span>
              )}
          </div>
        </div>

        {/* Unit Price Column - 2 units */}
        <div className="col-span-2 text-center">
          <div className="text-xs font-medium">
            ${Number(item.unitprice || item.price || 0).toFixed(2)}
          </div>
          <div className="text-xs text-gray-500">per unit</div>
        </div>

        {/* Quantity Column - 2 units */}
        <div className="col-span-2 text-center">
          {showQuantityControls && onQuantityChange ? (
            <div className="flex items-center justify-center gap-0.5">
              <button
                onClick={handleDecrease}
                className="w-5 h-5 flex items-center justify-center border rounded hover:bg-gray-100 text-xs"
              >
                -
              </button>
              <span className="w-5 text-center text-xs font-medium">
                {item.quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="w-5 h-5 flex items-center justify-center border rounded hover:bg-gray-100 text-xs"
              >
                +
              </button>
            </div>
          ) : (
            <span className="text-xs font-medium">{item.quantity}</span>
          )}
        </div>

        {/* Total Price Column - 1 unit (decreased from 2) */}
        {showTotal && (
          <div className="col-span-1 text-right">
            {hasDiscount ? (
              <div>
                <div className="text-gray-500 line-through text-xs">
                  {calculateTotalCurrency(unitPrice, item.quantity)}
                </div>
                <div className="text-red-600 font-semibold text-xs">
                  {formatCurrency(finalPrice)}
                </div>
                <div className="text-green-600 text-xs">
                  Save {formatCurrency(priceData?.discount || 0)}
                </div>
              </div>
            ) : (
              <div className="text-gray-800 font-semibold text-xs">
                {formatCurrency(finalPrice)}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
