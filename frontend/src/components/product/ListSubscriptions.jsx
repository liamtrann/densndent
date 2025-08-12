// src/components/ListSubscriptions.jsx
import React from "react";
import { Button, Dropdown } from "common";

/* date helpers */
function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}
function addMonthsSafe(date, months) {
  const d = new Date(date.getTime());
  const day = d.getDate();
  const targetMonth = d.getMonth() + months;
  const targetYear = d.getFullYear() + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  const endDay = daysInMonth(targetYear, normalizedMonth);
  const clamped = Math.min(day, endDay);
  const res = new Date(d);
  res.setFullYear(targetYear, normalizedMonth, clamped);
  return res;
}
function formatLocalDateToronto(date) {
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/Toronto",
  });
}
function nextFromToday(intervalStr) {
  const n = parseInt(intervalStr || "1", 10);
  return addMonthsSafe(new Date(), isNaN(n) ? 1 : n);
}

export default function ListSubscriptions({
  items,
  onCancel,
  onChangeInterval,
}) {
  if (!items?.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No subscriptions yet
        </h3>
        <p className="text-gray-500">
          Subscribe to products on their detail pages to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((s) => {
        const key = `${s.id}-${s.flavor || "no-flavor"}`;
        const nextDate = nextFromToday(s.interval);

        return (
          <div
            key={key}
            className="flex items-start gap-4 border rounded-md p-3"
          >
            {/* image */}
            {s.file_url ? (
              <img
                src={s.file_url}
                alt={s.displayname || s.itemid || "Product"}
                className="w-16 h-16 object-contain border rounded"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 border rounded" />
            )}

            {/* info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-semibold text-gray-800">
                  {s.displayname || s.itemid || `#${s.id}`}
                </div>
                {s.flavor && (
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded border">
                    {s.flavor}
                  </span>
                )}
              </div>

              <div className="mt-1 text-sm text-gray-600">
                Interval:{" "}
                {s.interval === "1" ? "Every 1 month" : `Every ${s.interval} months`}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                Next delivery: <span className="font-medium">{formatLocalDateToronto(nextDate)}</span>
              </div>

              {/* controls */}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="w-48">
                  <Dropdown
                    label="Change interval"
                    value={s.interval}
                    onChange={(e) => onChangeInterval(s, e.target.value)}
                    options={[
                      { value: "1", label: "Every 1 month" },
                      { value: "2", label: "Every 2 months" },
                      { value: "3", label: "Every 3 months" },
                      { value: "6", label: "Every 6 months" },
                    ]}
                  />
                </div>

                <Button
                  variant="danger"
                  onClick={() => onCancel(s)}
                  className="px-3 py-2"
                >
                  Cancel subscription
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
