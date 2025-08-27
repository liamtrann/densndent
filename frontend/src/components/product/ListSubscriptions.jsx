// src/components/product/ListSubscriptions.jsx
import { useAuth0 } from "@auth0/auth0-react";
import ConfirmCancelSubscription from "common/modals/ConfirmCancelSubscription";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import api from "api/api";
import endpoint from "api/endpoints";
import { Button, Dropdown, Loading, Paragraph, ProductImage } from "common";
import {
  SUBSCRIPTION_INTERVAL_OPTIONS as INTERVAL_OPTIONS,
  normalizeSubscriptionRecord,
  nextFromToday,
  formatLocalDateToronto,
  buildIntervalPatchPayload,
  SUBSCRIPTION_CANCEL_PAYLOAD,
} from "config/config";
import ToastNotification from "@/common/toast/Toast";

/** UI-size helpers so all compact controls match */
const CTRL_SIZE = "h-9";

// Compact status option labels
const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Pause" },
  { value: "canceled", label: "Cancel" },
];

// Map status choice to backend payloads
const STATUS_PAYLOADS = {
  active: { custrecord_ro_status: { id: "1" } },
  paused: { custrecord_ro_status: { id: "2" } },
  canceled: SUBSCRIPTION_CANCEL_PAYLOAD,
};

/* -----------------------------
   Helpers to parse API responses
   ----------------------------- */

/** Normalize to "active" | "paused" | "canceled" from many shapes */
function parseStatus(rec) {
  const raw = rec?.custrecord_ro_status;
  const id = raw?.id ?? raw?.value ?? rec?.statusId ?? rec?.status_id ?? null;
  const text =
    raw?.text ??
    raw?.label ??
    rec?.statusText ??
    rec?.status_text ??
    rec?.status ??
    null;

  const sid = String(id ?? "").trim();
  const st = String(text ?? "").trim().toLowerCase();

  if (sid === "3" || st.includes("cancel")) return "canceled";
  if (sid === "2" || st.includes("pause")) return "paused";
  if (sid === "1" || st.includes("active")) return "active";
  return "active";
}

/** Extract a YYYY-MM-DD from various backend date fields (string or Date) */
function pickNextRunDate(rec) {
  const raw =
    rec?.custrecord_ro_next_run ??
    rec?.next_run ??
    rec?.nextRun ??
    rec?.nextrun ??
    rec?.custrecord_next_run ??
    rec?.custrecord_ro_nextrun ??
    null;

  if (!raw) return null;

  const s = String(raw);
  const m = s.match(/^(\d{4}-\d{2}-\d2)/); // intentionally loose
  if (m) return m[1];

  const d = new Date(raw);
  if (!isNaN(d)) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return null;
}

/** Best effort route for clicking through */
function getProductHref(s) {
  const first =
    (s?.productId && String(s.productId).trim()) ||
    (s?.itemid && String(s.itemid).trim()) ||
    (s?.displayname && String(s.displayname).trim());
  return first ? `/product/${encodeURIComponent(first)}` : null;
}

/** Resolve a non-numeric id (or missing id) to a numeric internal id using your search endpoint. */
async function resolveProductIdFlexible(maybe, fallbackText) {
  const tryOne = async (query) => {
    if (!query) return null;
    const q = String(query).trim();
    if (!q) return null;
    try {
      const res = await api.post(
        endpoint.POST_GET_ITEMS_BY_NAME({ limit: 1 }),
        { name: q }
      );
      const arr = Array.isArray(res.data) ? res.data : res.data?.items || res.data;
      const first = Array.isArray(arr) ? arr[0] : undefined;
      return first?.id ? String(first.id) : null;
    } catch {
      return null;
    }
  };

  // Already numeric?
  if (/^\d+$/.test(String(maybe || ""))) return String(maybe);

  // Try several candidates
  return (
    (await tryOne(maybe)) ||
    (await tryOne(fallbackText)) ||
    (await tryOne(String(fallbackText || "").replace(/\s*-\s*.*/, ""))) || // drop trailing " - XXX"
    (await tryOne(
      String(fallbackText || "")
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    ))
  );
}

export default function ListSubscriptions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // per-row working state
  const [pending, setPending] = useState({}); // interval
  const [pendingDate, setPendingDate] = useState({}); // yyyy-mm-dd
  const [pendingStatus, setPendingStatus] = useState({}); // active/paused/canceled

  // baselines to detect dirty fields after initial load
  const [initialStatus, setInitialStatus] = useState({});
  const [initialDate, setInitialDate] = useState({}); // yyyy-mm-dd baseline

  // one save button at the bottom per row
  const [savingRow, setSavingRow] = useState({});

  const [confirming, setConfirming] = useState(null);

  const userInfo = useSelector((state) => state.user.info);
  const { getAccessTokenSilently } = useAuth0();

  const toInputDate = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  /** Fetch subscriptions */
  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!userInfo?.id) return;
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const res = await api.get(
          endpoint.GET_RECURRING_ORDERS_BY_CUSTOMER({
            customerId: userInfo.id,
            timestamp: Date.now(),
          }),
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const raw = res.data?.items || res.data || [];

        // Include PAUSED; exclude only CANCELED
        const activeOrPaused = raw.filter((r) => parseStatus(r) !== "canceled");

        // Normalize for the UI
        const subs = activeOrPaused.map(normalizeSubscriptionRecord);

        // Build maps for status and next run date
        const statusMap = {};
        const dateMap = {};
        activeOrPaused.forEach((r) => {
          const roId = r.id ?? r.internalid ?? r.roId;
          statusMap[roId] = parseStatus(r);
          dateMap[roId] = pickNextRunDate(r);
        });

        if (!mounted) return;

        // Set immediately so UI renders, then hydrate titles
        setItems(subs);

        // initialize interval working state
        const initIntervals = {};
        subs.forEach((s) => (initIntervals[s.roId] = s.interval));
        setPending(initIntervals);

        // initialize date baseline + working state
        const initDates = {};
        subs.forEach((s) => {
          const fromApi = dateMap[s.roId];
          initDates[s.roId] = fromApi || toInputDate(nextFromToday(s.interval));
        });
        setInitialDate(initDates);
        setPendingDate(initDates);

        // initialize status baseline + working state
        const initStatus = {};
        subs.forEach((s) => {
          initStatus[s.roId] = statusMap[s.roId] || "active";
        });
        setInitialStatus(initStatus);

        // Always hydrate pretty product titles from PDP data
        await hydratePrettyTitles(subs);
      } catch (err) {
        console.error("Error loading subscriptions:", err);
        ToastNotification.error("Failed to load subscriptions.");
        if (mounted) {
          setItems([]);
          setPending({});
          setPendingDate({});
          setInitialDate({});
          setPendingStatus({});
          setInitialStatus({});
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    /** Fetch real product titles for each row and update displayname/file_url. */
    async function hydratePrettyTitles(list) {
      // Map each row to a promise that ensures we end up with the PDP title
      const enriched = await Promise.all(
        list.map(async (s) => {
          try {
            // We prefer a numeric productId; otherwise resolve one from whatever text we have
            const candidateText =
              s.displayname || s.itemid || s.productId || `#${s.roId}`;
            const pid = /^\d+$/.test(String(s.productId || ""))
              ? String(s.productId)
              : await resolveProductIdFlexible(s.productId, candidateText);

            if (!pid) return s;

            const res = await api.get(endpoint.GET_PRODUCT_BY_ID(pid));
            const p = res?.data;
            if (!p) return s;

            return {
              ...s,
              // Use storefront PDP title (itemid in your system)
              displayname: p.itemid || p.displayname || s.displayname || s.itemid,
              itemid: p.itemid || s.itemid,
              // If we had no image, fill it from PDP
              file_url: s.file_url || p.file_url || s.file_url,
              // Keep the resolved numeric id to make links sturdier
              productId: String(pid),
            };
          } catch {
            return s;
          }
        })
      );

      setItems(enriched);
    }

    load();
    return () => {
      mounted = false;
    };
  }, [userInfo?.id, getAccessTokenSilently]);

  /* ---------- Handlers ---------- */
  const handleIntervalChange = (s, value) => {
    setPending((prev) => ({ ...prev, [s.roId]: value }));
  };

  const handleDateChange = (s, value) => {
    setPendingDate((prev) => ({ ...prev, [s.roId]: value }));
  };

  const handleStatusChange = (s, value) => {
    setPendingStatus((prev) => ({ ...prev, [s.roId]: value }));
  };

  /** Single bottom SAVE — saves interval + next date + status together */
  const handleSaveAll = async (s) => {
    const roId = s.roId;

    const intervalNow = pending[roId] ?? s.interval;
    const isDirtyInterval = intervalNow !== s.interval;

    const dateVal = pendingDate[roId] ?? initialDate[roId];
    const baselineDate = initialDate[roId];
    const isDirtyDate = !!dateVal && dateVal !== baselineDate;

    const statusVal = pendingStatus[roId] ?? initialStatus[roId] ?? "active";
    const isDirtyStatus =
      (initialStatus[roId] ?? "active") !== (statusVal ?? "active");

    // If cancel chosen, confirm + remove
    if (statusVal === "canceled") {
      setConfirming(s);
      return;
    }

    // Build single PATCH payload with only changed fields
    const payload = {};
    if (isDirtyInterval)
      Object.assign(payload, buildIntervalPatchPayload(intervalNow));
    if (isDirtyDate) payload.custrecord_ro_next_run = dateVal;
    if (isDirtyStatus) Object.assign(payload, STATUS_PAYLOADS[statusVal]);

    if (Object.keys(payload).length === 0) return;

    setSavingRow((prev) => ({ ...prev, [roId]: true }));
    try {
      const token = await getAccessTokenSilently();
      await api.patch(endpoint.UPDATE_RECURRING_ORDER(roId), payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (isDirtyInterval) {
        setItems((prev) =>
          prev.map((it) =>
            it.roId === roId ? { ...it, interval: String(intervalNow) } : it
          )
        );
      }
      if (isDirtyStatus) {
        setInitialStatus((prev) => ({ ...prev, [roId]: statusVal }));
      }
      if (isDirtyDate) {
        setInitialDate((prev) => ({ ...prev, [roId]: dateVal }));
      }

      ToastNotification.success("Subscription changes saved.");
    } catch (err) {
      console.error("Failed to save subscription changes:", err);
      ToastNotification.error("Failed to save. Please try again.");
    } finally {
      setSavingRow((prev) => ({ ...prev, [roId]: false }));
    }
  };

  /** Actually cancel (called by modal confirm) */
  const [savingStatus, setSavingStatus] = useState({});
  const performCancel = async (s) => {
    setSavingStatus((prev) => ({ ...prev, [s.roId]: true }));
    try {
      const token = await getAccessTokenSilently();
      const response = await api.patch(
        endpoint.UPDATE_RECURRING_ORDER(s.roId),
        STATUS_PAYLOADS.canceled,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status >= 200 && response.status < 300) {
        setItems((prev) => prev.filter((it) => it.roId !== s.roId));
        setPending((prev) => {
          const cp = { ...prev };
          delete cp[s.roId];
          return cp;
        });
        setPendingDate((prev) => {
          const cp = { ...prev };
          delete cp[s.roId];
          return cp;
        });
        setInitialDate((prev) => {
          const cp = { ...prev };
          delete cp[s.roId];
          return cp;
        });
        setPendingStatus((prev) => {
          const cp = { ...prev };
          delete cp[s.roId];
          return cp;
        });
        setInitialStatus((prev) => {
          const cp = { ...prev };
          delete cp[s.roId];
          return cp;
        });
        ToastNotification.success("Subscription canceled.");
      } else {
        throw new Error("Failed to cancel subscription");
      }
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
      ToastNotification.error("Failed to cancel subscription. Please try again.");
    } finally {
      setSavingStatus((prev) => ({ ...prev, [s.roId]: false }));
      setConfirming(null);
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="text-center py-12">
        <Loading />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No active subscriptions
        </h3>
        <Paragraph className="text-gray-500">
          Subscribe to products on their detail pages to see them here.
        </Paragraph>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {items.map((s) => {
          const roId = s.roId;

          const intervalNow = pending[roId] ?? s.interval;
          const dateVal = pendingDate[roId] ?? initialDate[roId];
          const statusVal =
            pendingStatus[roId] ?? initialStatus[roId] ?? "active";

          const isDirtyInterval = intervalNow !== s.interval;
          const isDirtyDate = !!dateVal && dateVal !== initialDate[roId];
          const isDirtyStatus =
            (initialStatus[roId] ?? "active") !== (statusVal ?? "active");

          const isSavingCombined = !!savingRow[roId];

          const href = getProductHref(s);
          const title =
            s.displayname || s.itemid || `#${s.productId || s.roId}`;

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
            <div key={roId} className="flex items-start gap-4 border rounded-md p-3">
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
                    className={`${CTRL_SIZE} border rounded px-2 text-xs`}
                    value={dateVal}
                    onChange={(e) => handleDateChange(s, e.target.value)}
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

                {/* Controls: Change interval + Subscription */}
                <div className="mt-3 flex flex-wrap items-end gap-3">
                  <div className="w-56">
                    <Dropdown
                      label="Change interval"
                      value={intervalNow}
                      onChange={(e) => handleIntervalChange(s, e.target.value)}
                      options={INTERVAL_OPTIONS}
                      className="h-10 text-sm w-full"
                      wrapperClassName="mb-0"
                    />
                  </div>

                  <div className="w-56">
                    <Dropdown
                      label="Subscription"
                      value={statusVal}
                      onChange={(e) => handleStatusChange(s, e.target.value)}
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
                      !(isDirtyInterval || isDirtyDate || isDirtyStatus) ||
                      isSavingCombined
                    }
                    onClick={() => handleSaveAll(s)}
                  >
                    {isSavingCombined ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal for "Cancel subscription" */}
      <ConfirmCancelSubscription
        open={!!confirming}
        productTitle={confirming?.displayname || confirming?.itemid}
        loading={confirming ? !!savingStatus[confirming.roId] : false}
        onClose={() => setConfirming(null)}
        onConfirm={() => confirming && performCancel(confirming)}
      />
    </>
  );
}
