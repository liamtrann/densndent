import React, { useEffect, useState } from "react";
import { Button, Dropdown, Paragraph, ProductImage } from "common";
import api from "api/api";
import endpoint from "api/endpoints";
import { useSelector } from "react-redux";

/* ===== subscription helpers ===== */
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

/** Normalize a backend subscription record into the UI shape we need
 * We keep BOTH:
 *  - roId      = recurring order record id (used for PATCH cancel/update)
 *  - productId = item id (used to backfill image via POST_GET_ITEM_BY_IDS)
 */
function normalizeSub(r) {
  const roId = r.id ?? r.internalid ?? r.roId;
  const productId = r.itemId ?? r.item_id ?? r.productId;
  return {
    roId,
    productId,
    itemid:
      r.itemid ||
      r.itemName ||
      r.name ||
      r.displayname ||
      `#${productId || roId}`,
    displayname:
      r.displayname ||
      r.itemName ||
      r.name ||
      r.itemid ||
      `#${productId || roId}`,
    file_url: r.file_url || r.image || r.thumbnail || r.fileUrl || "",
    interval: String(
      r.interval || r.custrecord_ro_interval || r.recurringInterval || "1"
    ),
  };
}

export default function ListSubscriptions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // interval edits per subscription: { [roId]: "1" | "2" | "3" | "6" }
  const [pending, setPending] = useState({});
  const [saving, setSaving] = useState({});    // { [roId]: boolean }
  const [canceling, setCanceling] = useState({}); // { [roId]: boolean }

  const userInfo = useSelector((state) => state.user.info);

  // Load subscriptions + backfill images if missing
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!userInfo?.id) return;
      setLoading(true);
      try {
        // 1) fetch subscriptions for this customer
        const res = await api.get(
          endpoint.GET_RECURRING_ORDERS_BY_CUSTOMER({ customerId: userInfo.id })
        );
        const raw = res.data?.items || res.data || [];
        let subs = raw.map(normalizeSub);

        // 2) backfill missing images using product ids
        const missingProductIds = subs
          .filter((s) => !s.file_url && s.productId)
          .map((s) => s.productId);
        if (missingProductIds.length) {
          try {
            const prodRes = await api.post(endpoint.POST_GET_ITEM_BY_IDS(), {
              ids: missingProductIds,
            });
            const products = prodRes.data?.items || prodRes.data || [];
            const byId = new Map(
              products.map((p) => [
                p.id,
                p.file_url || p.thumbnail || p.image || "",
              ])
            );
            subs = subs.map((s) =>
              s.file_url
                ? s
                : {
                    ...s,
                    file_url: byId.get(s.productId) || "",
                  }
            );
          } catch {
            /* swallow image backfill failure */
          }
        }

        if (mounted) {
          setItems(subs);
          // initialize pending intervals from current data
          const init = {};
          subs.forEach((s) => (init[s.roId] = s.interval));
          setPending(init);
        }
      } catch (err) {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [userInfo?.id]);

  const handleIntervalChange = (s, value) => {
    setPending((prev) => ({ ...prev, [s.roId]: value }));
  };

  const handleSaveInterval = async (s) => {
    const selected = pending[s.roId];
    if (!selected || selected === s.interval) return;

    setSaving((prev) => ({ ...prev, [s.roId]: true }));
    try {
      await api.patch(endpoint.SET_RECURRING_ORDER_INTERVAL(s.roId), {
        custrecord_ro_interval: Number(selected),
      });

      // reflect update locally
      setItems((prev) =>
        prev.map((it) =>
          it.roId === s.roId ? { ...it, interval: String(selected) } : it
        )
      );
    } finally {
      setSaving((prev) => ({ ...prev, [s.roId]: false }));
    }
  };

  const handleCancel = async (s) => {
    if (!window.confirm("Cancel this subscription?")) return;

    setCanceling((prev) => ({ ...prev, [s.roId]: true }));
    try {
      await api.patch(endpoint.CANCEL_RECURRING_ORDER(s.roId), {
        custrecord_ro_status: { id: "3" },
      });

      // remove from list
      setItems((prev) => prev.filter((it) => it.roId !== s.roId));
      // clean up local state
      setPending((prev) => {
        const cp = { ...prev };
        delete cp[s.roId];
        return cp;
      });
    } finally {
      setCanceling((prev) => ({ ...prev, [s.roId]: false }));
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="text-center py-12">
        <Paragraph>Loading subscriptions…</Paragraph>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No subscriptions yet
        </h3>
        <Paragraph className="text-gray-500">
          Subscribe to products on their detail pages to see them here.
        </Paragraph>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((s) => {
        const intervalNow = pending[s.roId] ?? s.interval;
        const nextDate = nextFromToday(s.interval); // next date based on saved interval

        const isDirty = intervalNow !== s.interval;
        const isSaving = !!saving[s.roId];
        const isCanceling = !!canceling[s.roId];

        return (
          <div
            key={s.roId}
            className="flex items-start gap-4 border rounded-md p-3"
          >
            {/* image */}
            <ProductImage
              src={s.file_url}
              alt={s.displayname || s.itemid || "Product"}
              className="w-16 h-16 object-contain border rounded"
            />

            {/* info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-semibold text-gray-800">
                  {s.displayname || s.itemid || `#${s.productId || s.roId}`}
                </div>
              </div>

              <Paragraph className="mt-1 text-sm text-gray-600">
                Interval:{" "}
                {s.interval === "1"
                  ? "Every 1 month"
                  : `Every ${s.interval} months`}
              </Paragraph>

              <Paragraph className="text-xs text-gray-500 mt-1">
                Next delivery:{" "}
                <span className="font-medium">
                  {formatLocalDateToronto(nextDate)}
                </span>
              </Paragraph>

              {/* controls */}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="w-48">
                  <Dropdown
                    label="Change interval"
                    value={intervalNow}
                    onChange={(e) => handleIntervalChange(s, e.target.value)}
                    options={INTERVAL_OPTIONS}
                    className="h-10"
                  />
                </div>

                {/* Save (ghost, same height as select) */}
                <Button
                  variant="ghost"
                  className="h-10 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={!isDirty || isSaving || isCanceling}
                  onClick={() => handleSaveInterval(s)}
                >
                  {isSaving ? "Saving…" : "Save"}
                </Button>

                {/* Cancel (light/ghost, same height as select) */}
                <Button
                  variant="dangerGhost"
                  className="h-10 px-4 whitespace-nowrap font-normal"
                  disabled={isSaving || isCanceling}
                  onClick={() => handleCancel(s)}
                >
                  {isCanceling ? "Cancelling…" : "Cancel subscription"}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
