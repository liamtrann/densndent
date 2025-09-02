// src/components/product/SubscriptionRow.jsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
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
  DateUtils,
} from "config/config";
import {
  STATUS_OPTIONS,
  SUBS_CTRL_HEIGHT_CLASS,
  getProductHref,
} from "config/subscriptions";

export default function SubscriptionRow({ s, initialData, onSave, isSaving }) {
  const href = getProductHref(s);
  const title = s.displayname || s.itemid || `#${s.productId || s.roId}`;

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { isDirty },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      interval: initialData?.interval || s.interval || "1",
      date: initialData?.date || "",
      status: initialData?.status || "active",
      deliveryDays: initialData?.deliveryDays || [],
    },
  });

  // Watch values for display
  const watchedInterval = watch("interval");
  const watchedDate = watch("date");
  const watchedDeliveryDays = watch("deliveryDays");

  const onSubmit = async (formData) => {
    await onSave(s, formData);
    // Reset form to mark as clean after successful save
    reset(formData);
  };

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
    <form onSubmit={handleSubmit(onSubmit)}>
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
            {watchedInterval === "1"
              ? "Every 1 month"
              : `Every ${watchedInterval} months`}
          </Paragraph>

          {/* Next Order: date picker */}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-gray-500">Next Order:</span>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <input
                  type="date"
                  min={DateUtils.toInput(new Date())}
                  className={`${SUBS_CTRL_HEIGHT_CLASS} border rounded px-2 text-xs`}
                  value={field.value}
                  onChange={field.onChange}
                  aria-label="Choose next order date (cannot be in the past)"
                />
              )}
            />
            <span className="text-[11px] text-gray-400">
              ({formatLocalDateToronto(new Date(watchedDate))})
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
              {watchedDeliveryDays && watchedDeliveryDays.length > 0
                ? formatDeliveryDays(watchedDeliveryDays)
                : "No preference set"}
            </div>
            <Controller
              name="deliveryDays"
              control={control}
              render={({ field }) => (
                <WeekdaySelector
                  selectedDays={field.value || []}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Controls: Change interval + Subscription */}
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <div className="w-56">
              <Controller
                name="interval"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    label="Change interval"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    options={INTERVAL_OPTIONS}
                    className="h-10 text-sm w-full"
                    wrapperClassName="mb-0"
                  />
                )}
              />
            </div>

            <div className="w-56">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    label="Subscription"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    options={STATUS_OPTIONS}
                    className="h-10 text-sm w-full"
                    wrapperClassName="mb-0"
                  />
                )}
              />
            </div>
          </div>

          {/* Single bottom Save */}
          <div className="mt-3 flex justify-end">
            <Button
              type="submit"
              variant="ghost"
              className="h-10 text-sm w-56 border border-gray-300 rounded px-3 text-gray-700 hover:bg-gray-50"
              disabled={!isDirty || isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
