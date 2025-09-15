import React from "react";

import { ProductImage } from "common";
import { formatDeliveryDays } from "config/config";

export default function CartLayout({
  item,
  imageSize = "w-12 h-12",
  textSize = "text-sm",
  compact = false,
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
    <div
      className={`flex items-start gap-3 ${compact ? "pb-2" : "p-3"} border-b`}
    >
      <ProductImage
        src={item.file_url || item.img1 || item.imageurl}
        alt={item.itemid || item.displayname}
        className={`${imageSize} object-cover ${
          compact ? "" : "border rounded"
        } ${onItemClick ? "cursor-pointer" : ""}`}
        onClick={onItemClick ? () => onItemClick(item.id) : undefined}
      />
      <div className={`flex-1 ${textSize}`}>
        <div
          className={`font-medium line-clamp-2 ${
            onItemClick ? "text-blue-700 hover:underline cursor-pointer" : ""
          }`}
          onClick={onItemClick ? () => onItemClick(item.id) : undefined}
        >
          {item.itemid || item.displayname}
        </div>

        {item.stockdescription && (
          <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded inline-block mt-1 mb-1">
            {item.stockdescription}
          </span>
        )}

        {item.subscriptionEnabled && (
          <div className="text-xs text-white font-medium bg-smiles-gentleBlue px-1.5 py-0.5 rounded inline-block mt-1 mb-1">
            Subscription: Every {item.subscriptionInterval}{" "}
            {item.subscriptionUnit}
          </div>
        )}

        {item.subscriptionEnabled && item.subscriptionPreferredDeliveryDays && (
          <div className="text-xs text-orange-700 font-medium bg-orange-50 px-2 py-1 rounded inline-block mt-1 mb-1">
            Prefer Delivery days:{" "}
            {formatDeliveryDays(item.subscriptionPreferredDeliveryDays)}
          </div>
        )}

        {!compact && (
          <div className="text-gray-600 mt-1">
            Unit price: ${Number(item.unitprice || item.price || 0).toFixed(2)}
          </div>
        )}

        {showQuantityControls && onQuantityChange ? (
          <div className="flex items-center gap-2 mt-1">
            <span>Quantity</span>
            <button
              onClick={handleDecrease}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={handleIncrease}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              +
            </button>
          </div>
        ) : (
          <div className="mt-1">Quantity: {item.quantity}</div>
        )}

        {showTotal && (
          <div className="mt-1">
            {hasDiscount ? (
              <div>
                <div className="text-gray-500 line-through text-xs">
                  {calculateTotalCurrency(unitPrice, item.quantity)}
                </div>
                <div className="text-red-600 font-semibold">
                  {formatCurrency(finalPrice)}
                </div>
                <div className="text-green-600 text-xs">
                  Save {formatCurrency(priceData?.discount || 0)}
                </div>
              </div>
            ) : (
              <div className="text-gray-800 font-semibold">
                {formatCurrency(finalPrice)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
