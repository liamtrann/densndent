// src/components/product/ListSubscriptions.jsx
import React, { useEffect } from "react";
import { Button, Dropdown, Image, Paragraph } from "common";
import { api } from "@/api";
import endpoint from "@/api/endpoints";
import { useSelector } from "react-redux";

const INTERVAL_OPTIONS = [
  { value: "1", label: "Every 1 month" },
  { value: "2", label: "Every 2 months" },
  { value: "3", label: "Every 3 months" },
  { value: "6", label: "Every 6 months" },
];

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
  return addMonthsSafe(new Date(), Number.isFinite(n) ? n : 1);
}

export default function ListSubscriptions() {
  const [items,setItems] = React.useState([]);
  const userInfo = useSelector((state) => state.user.info);

  useEffect(() => {
    if (!userInfo) return;
    const subscriptions = api.get(endpoint.GET_RECURRING_ORDERS_BY_CUSTOMER(userInfo.id));
    subscriptions.then((res) => {
      if (res.data && Array.isArray(res.data)) {
        setItems(res.data);
      } else {
        setItems([]);
      }
    }).catch((err) => {
      console.error("Failed to fetch subscriptions:", err);
      setItems([]);
    });
  }, [userInfo]);

  console.log(items)
  
  if (!items.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No subscriptions yet</h3>
        <Paragraph className="text-gray-500">
          Subscribe to products on their detail pages to see them here.
        </Paragraph>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((s) => {
        const nextDate = nextFromToday(s.interval);

        return (
          <div key={s.id} className="flex items-start gap-4 border rounded-md p-3">
            <Image
              src={s.file_url}
              alt={s.displayname || s.itemid || "Product"}
              className="w-16 h-16 object-contain border rounded"
            />

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-semibold text-gray-800">
                  {s.displayname || s.itemid || `#${s.id}`}
                </div>
              </div>

              <Paragraph className="mt-1 text-sm text-gray-600">
                Interval: {s.interval === "1" ? "Every 1 month" : `Every ${s.interval} months`}
              </Paragraph>

              <Paragraph className="text-xs text-gray-500 mt-1">
                Next delivery: <span className="font-medium">{formatLocalDateToronto(nextDate)}</span>
              </Paragraph>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="w-48">
                  <Dropdown
                    label="Change interval"
                    value={s.interval}
                    options={INTERVAL_OPTIONS}
                  />
                </div>

                <Button variant="danger" className="px-3 py-2">
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
