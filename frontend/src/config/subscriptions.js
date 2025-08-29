// src/config/subscriptions.js
import {
  buildIntervalPatchPayload,
  DateUtils,
  resolveProductIdByNameOrId,
} from "./config";

/** Status options for the dropdown */
export const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Pause" },
  { value: "canceled", label: "Cancel" },
];

/** Back-end status payloads (maps UI value -> PATCH body) */
export const STATUS_PAYLOADS = {
  active: { custrecord_ro_status: { id: "1" } },
  paused: { custrecord_ro_status: { id: "2" } },
  canceled: { custrecord_ro_status: { id: "3" } },
};

/** Always include this on save (your requirement) */
export const DEFAULT_PREFERRED_DELIVERY = {
  items: [{ id: 1 }, { id: 2 }, { id: 3 }],
};

/** Shared UI sizing class for compact inputs */
export const SUBS_CTRL_HEIGHT_CLASS = "h-9";

/** Normalize to "active" | "paused" | "canceled" from many shapes */
export function parseStatus(rec) {
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
  const st = String(text ?? "")
    .trim()
    .toLowerCase();

  if (sid === "3" || st.includes("cancel")) return "canceled";
  if (sid === "2" || st.includes("pause")) return "paused";
  if (sid === "1" || st.includes("active")) return "active";
  return "active";
}

/** Extract YYYY-MM-DD from common backend fields (string or Date) */
export function pickNextRunDate(rec) {
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
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];

  const d = new Date(raw);
  if (!isNaN(d)) return DateUtils.toInput(d);
  return null;
}

/** Best-effort PDP link */
export function getProductHref(s) {
  const first =
    (s?.productId && String(s.productId).trim()) ||
    (s?.itemid && String(s.itemid).trim()) ||
    (s?.displayname && String(s.displayname).trim());
  return first ? `/product/${encodeURIComponent(first)}` : null;
}

/** Build a single PATCH body; includePreferredDelivery keeps your required field */
export function buildRecurringOrderPatch({
  interval,
  date,
  status,
  includePreferredDelivery = true,
}) {
  const payload = {};
  if (includePreferredDelivery) {
    payload.custrecord_prefer_delivery = DEFAULT_PREFERRED_DELIVERY;
  }
  if (interval != null)
    Object.assign(payload, buildIntervalPatchPayload(interval));
  if (date) payload.custrecord_ro_next_run = date;
  if (status && STATUS_PAYLOADS[status])
    Object.assign(payload, STATUS_PAYLOADS[status]);
  return payload;
}

/** Hydrate list with PDP title/image and solid numeric productId */
export async function enrichSubscriptionsWithPdp(list) {
  const { default: api } = await import("../api/api.js");
  const { default: endpoint } = await import("../api/endpoints.js");

  const enriched = await Promise.all(
    list.map(async (s) => {
      try {
        const candidate =
          s.displayname || s.itemid || s.productId || `#${s.roId}`;
        const pid = /^\d+$/.test(String(s.productId || ""))
          ? String(s.productId)
          : await resolveProductIdByNameOrId(candidate);

        if (!pid) return s;

        const res = await api.get(endpoint.GET_PRODUCT_BY_ID(pid));
        const p = res?.data;
        if (!p) return s;

        return {
          ...s,
          displayname: p.itemid || p.displayname || s.displayname || s.itemid,
          itemid: p.itemid || s.itemid,
          file_url: s.file_url || p.file_url || s.file_url,
          productId: String(pid),
        };
      } catch {
        return s;
      }
    })
  );

  return enriched;
}
