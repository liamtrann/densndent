// src/components/product/SubscriptionRow.jsx
import React from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Dropdown,
  Paragraph,
  ProductImage,
  WeekdaySelector,
} from "common";
import {
  SUBSCRIPTION_INTERVAL_OPTIONS as INTERVAL_OPTIONS,
  formatLocalDateToronto,
  formatDeliveryDays,
} from "config/config";
import {
  STATUS_OPTIONS,
  SUBS_CTRL_HEIGHT_CLASS,
  getProductHref,
} from "config/subscriptions";

export default function SubscriptionRow({
  s,
  intervalNow,
  dateVal,
  statusVal,
  deliveryVal,
  isDirtyInterval,
  isDirtyDate,
  isDirtyStatus,
  isDirtyDelivery,
  isSavingCombined,
  onChangeInterval,
  onChangeDate,
  onChangeStatus,
  onChangeDelivery,
  onSave,
}) {
  const href = getProductHref(s);
  const title = s.displayname || s.itemid || `#${s.productId || s.roId}`;

  const ImageWrap = href
    ? ({ children }) => (
        <Link
          to={href}
          className="inline-block focus:outline-none focus:ring-2 focus:ring-smiles-orange rounded"
          aria-label={`View ${title}`}
          title={title}
        >
          {children}
        </Link>
      )
    : ({ children }) => <>{children}</>;

  const TitleWrap = href
    ? ({ children }) => (
        <Link
          to={href}
          className="text-gray-900 hover:text-smiles-blue focus:outline-none focus:ring-2 focus:ring-smiles-orange rounded"
          aria-label={`View ${title}`}
          title={title}
        >
          {children}
        </Link>
      )
    : ({ children }) => <span className="text-gray-900">{children}</span>;

  return (
    <div className="flex items-start gap-4 border rounded-md p-3">
      <ImageWrap>
        <ProductImage
          src={s.file_url}
          alt={title}
          className="w-16 h-16 object-contain border rounded"
        />
      </ImageWrap>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-semibold text-gray-800">
            <TitleWrap>{title}</TitleWrap>
          </div>
        </div>

        <Paragraph className="mt-1 text-sm text-gray-600">
          Interval:{" "}
          {intervalNow === "1"
            ? "Every 1 month"
            : `Every ${intervalNow} months`}
        </Paragraph>

        {/* Next Order: date picker */}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-gray-500">Next Order:</span>
          <input
            type="date"
            className={`${SUBS_CTRL_HEIGHT_CLASS} border rounded px-2 text-xs`}
            value={dateVal}
            onChange={(e) => onChangeDate(s, e.target.value)}
            aria-label="Choose next order date"
          />
          <span className="text-[11px] text-gray-400">
            ({formatLocalDateToronto(new Date(dateVal))})
          </span>
        </div>

        {/* Estimated delivery */}
        <Paragraph className="text-xs text-gray-500 mt-1">
          Estimated Delivery: <span className="font-medium">5 Days</span>
        </Paragraph>

        {/* Preferred Delivery Days */}
        <div className="mt-2">
          <span className="text-xs text-gray-500 block mb-2">
            Preferred Delivery Days:
          </span>
          <div className="text-xs text-gray-600 mb-2">
            {deliveryVal && deliveryVal.length > 0
              ? formatDeliveryDays(deliveryVal)
              : "No preference set"}
          </div>
          <WeekdaySelector
            selectedDays={deliveryVal || []}
            onChange={(days) => onChangeDelivery(s, days)}
          />
        </div>

        {/* Controls: Change interval + Subscription */}
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div className="w-56">
            <Dropdown
              label="Change interval"
              value={intervalNow}
              onChange={(e) => onChangeInterval(s, e.target.value)}
              options={INTERVAL_OPTIONS}
              className="h-10 text-sm w-full"
              wrapperClassName="mb-0"
            />
          </div>

          <div className="w-56">
            <Dropdown
              label="Subscription"
              value={statusVal}
              onChange={(e) => onChangeStatus(s, e.target.value)}
              options={STATUS_OPTIONS}
              className="h-10 text-sm w-full"
              wrapperClassName="mb-0"
            />
          </div>
        </div>

        {/* Single bottom Save */}
        <div className="mt-3 flex justify-end">
          <Button
            variant="ghost"
            className="h-10 text-sm w-56 border border-gray-300 rounded px-3 text-gray-700 hover:bg-gray-50"
            disabled={
              !(
                isDirtyInterval ||
                isDirtyDate ||
                isDirtyStatus ||
                isDirtyDelivery
              ) || isSavingCombined
            }
            onClick={() => onSave(s)}
          >
            {isSavingCombined ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
