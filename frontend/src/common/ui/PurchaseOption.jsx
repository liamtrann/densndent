import React from "react";

import { PurchaseOptions } from "common";

export default function PurchaseOption({
  name,
  isSubscribed,
  interval,
  onOneTime,
  onSubscribe,
  onIntervalChange,
  onRemoveClick,
  formatLocalDateToronto,
  firstDeliveryDate,
  listType = "row",
}) {
  return listType === "row" ? (
    // Row layout - horizontal arrangement
    <div className="w-full flex flex-col lg:flex-row lg:items-center gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex-1 min-w-0">
        <PurchaseOptions
          name={name}
          isSubscribed={isSubscribed}
          interval={interval}
          onOneTime={onOneTime}
          onSubscribe={onSubscribe}
          onIntervalChange={onIntervalChange}
        />
      </div>

      {isSubscribed && (
        <div className="flex-1 lg:flex-[2] lg:max-w-md text-xs text-gray-600 lg:text-left px-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2">
            <span className="font-medium whitespace-nowrap">Next order:</span>
            <span className="font-medium text-gray-800">
              {formatLocalDateToronto(firstDeliveryDate)}
            </span>
            <span className="text-gray-500">
              ({interval === "1" ? "every 1 month" : `every ${interval} months`}
              )
            </span>
          </div>
        </div>
      )}

      <div className="flex-shrink-0">
        <button
          onClick={onRemoveClick}
          className="text-red-600 text-sm underline hover:text-red-800 whitespace-nowrap"
        >
          Remove from cart
        </button>
      </div>
    </div>
  ) : (
    // Column layout - vertical arrangement (default)
    <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0">
      <PurchaseOptions
        name={name}
        isSubscribed={isSubscribed}
        interval={interval}
        onOneTime={onOneTime}
        onSubscribe={onSubscribe}
        onIntervalChange={onIntervalChange}
      />

      {isSubscribed && (
        <div className="mt-2 text-xs text-gray-600">
          <span className="font-medium">Next order:</span>{" "}
          <span>{formatLocalDateToronto(firstDeliveryDate)}</span>
          <span className="ml-1">
            ({interval === "1" ? "every 1 month" : `every ${interval} months`})
          </span>
        </div>
      )}

      <button
        onClick={onRemoveClick}
        className="text-red-600 text-sm underline mt-3 hover:text-red-800"
      >
        Remove from cart
      </button>
    </div>
  );
}
