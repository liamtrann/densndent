// src/components/cart/CartItemCard.jsx
import React from "react";
import PurchaseOptions from "@/common/ui/PurchaseOptions";
import { PreviewCartItem } from "@/common";

export default function CartItemCard({
  item,
  inventory,
  outOfStockText,
  isSubbed,
  interval,
  nextDateText,
  onQtyChange,
  onClickItem,
  onOneTime,
  onSubscribe,
  onIntervalChange,
  onRemove,
}) {
  const key = item.id + (item.flavor ? `-${item.flavor}` : "");

  return (
    <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* LEFT: Product block */}
        <div className="flex-1 min-w-0">
          <PreviewCartItem
            key={key}
            item={item}
            onQuantityChange={onQtyChange}
            onItemClick={onClickItem}
            showQuantityControls
            showTotal
            compact={false}
            imageSize="w-24 h-24"
            textSize="text-base"
            showBottomBorder={false}
          />
          {inventory && inventory.quantityavailable <= 0 && (
            <div className="text-red-600 text-sm mt-2">{outOfStockText}</div>
          )}
        </div>

        {/* RIGHT: Purchase controls (inside same card) */}
        <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0">
          <PurchaseOptions
            name={key}
            isSubscribed={isSubbed}
            interval={interval}
            onOneTime={onOneTime}
            onSubscribe={onSubscribe}
            onIntervalChange={onIntervalChange}
          />

          {isSubbed && (
            <div className="mt-2 text-xs text-gray-600">{nextDateText}</div>
          )}

          <button
            onClick={onRemove}
            className="text-red-600 text-sm underline mt-3 hover:text-red-800"
          >
            Remove from cart
          </button>
        </div>
      </div>
    </div>
  );
}
