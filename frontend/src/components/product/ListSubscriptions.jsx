import { useAuth0 } from "@auth0/auth0-react";
import ConfirmCancelSubscription from "common/modals/ConfirmCancelSubscription";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import api from "api/api";
import endpoint from "api/endpoints";
import { Button, Dropdown, Loading, Paragraph, ProductImage } from "common";
import {
  SUBSCRIPTION_INTERVAL_OPTIONS as INTERVAL_OPTIONS,
  normalizeSubscriptionRecord,
  isSubscriptionCanceled,
  nextFromToday,
  formatLocalDateToronto,
  buildIntervalPatchPayload,
  SUBSCRIPTION_CANCEL_PAYLOAD,
} from "config/config";

import ToastNotification from "@/common/toast/Toast";

/** UI-size helpers so all compact controls match */
const CTRL_SIZE = "h-9";
const BTN_TIGHT = `${CTRL_SIZE} leading-none px-3 text-xs`;

const STATUS_OPTIONS = [
  { value: "active", label: "Active subscription" },
  { value: "paused", label: "Pause subscription" },
  { value: "canceled", label: "Cancel subscription" },
];

/** Map status choice to backend payloads.
 * Adjust IDs here if your NetSuite custom record uses different values:
 *   1 = Active, 2 = Paused, 3 = Canceled
 */
const STATUS_PAYLOADS = {
  active: { custrecord_ro_status: { id: "1" } },
  paused: { custrecord_ro_status: { id: "2" } },
  canceled: SUBSCRIPTION_CANCEL_PAYLOAD, // { custrecord_ro_status: { id: "3" } }
};

export default function ListSubscriptions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // per-row states
  const [pending, setPending] = useState({});        // interval (string)
  const [saving, setSaving] = useState({});          // saving interval flag

  const [pendingDate, setPendingDate] = useState({}); // yyyy-mm-dd per roId
  const [savingDate, setSavingDate] = useState({});   // saving date flag

  // NEW: per-row subscription status
  const [pendingStatus, setPendingStatus] = useState({}); // "active" | "paused" | "canceled"
  const [savingStatus, setSavingStatus] = useState({});   // status save flag

  // cancel confirm modal
  const [confirming, setConfirming] = useState(null);     // row pending cancel

  const userInfo = useSelector((state) => state.user.info);
  const { getAccessTokenSilently } = useAuth0();

  // helper → format Date as YYYY-MM-DD (local)
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

        // build a status map from raw so we can prefill "paused" if present
        const statusMap = {};
        raw.forEach((r) => {
          const sid = String(
            r?.custrecord_ro_status?.id ??
            r?.custrecord_ro_status ??
            r?.statusId ??
            r?.status ??
            ""
          );
          statusMap[
            r.id ?? r.internalid ?? r.roId
          ] = sid === "3" ? "canceled" : sid === "2" ? "paused" : "active";
        });

        const activeOnly = raw.filter((r) => !isSubscriptionCanceled(r));
        const subs = activeOnly.map(normalizeSubscriptionRecord);

        if (mounted) {
          setItems(subs);

          // init interval state
          const initIntervals = {};
          subs.forEach((s) => (initIntervals[s.roId] = s.interval));
          setPending(initIntervals);

          // init date state (default to computed next from interval)
          const initDates = {};
          subs.forEach((s) => {
            const computed = nextFromToday(s.interval);
            initDates[s.roId] = toInputDate(computed);
          });
          setPendingDate(initDates);

          // init status (use raw-derived map; canceled ones were filtered out)
          const initStatus = {};
          subs.forEach((s) => {
            initStatus[s.roId] = statusMap[s.roId] || "active";
          });
          setPendingStatus(initStatus);
        }
      } catch (err) {
        console.error("Error loading subscriptions:", err);
        ToastNotification.error("Failed to load subscriptions.");
        if (mounted) {
          setItems([]);
          setPending({});
          setPendingDate({});
          setPendingStatus({});
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [userInfo?.id, getAccessTokenSilently]);

  /* ---------- Interval handlers ---------- */
  const handleIntervalChange = (s, value) => {
    setPending((prev) => ({ ...prev, [s.roId]: value }));
  };

  const handleSaveInterval = async (s) => {
    const selected = pending[s.roId];
    if (!selected || selected === s.interval) return;

    setSaving((prev) => ({ ...prev, [s.roId]: true }));
    try {
      const token = await getAccessTokenSilently();
      await api.patch(
        endpoint.UPDATE_RECURRING_ORDER(s.roId),
        buildIntervalPatchPayload(selected),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setItems((prev) =>
        prev.map((it) =>
          it.roId === s.roId ? { ...it, interval: String(selected) } : it
        )
      );
      ToastNotification.success("Subscription interval saved.");
    } catch (err) {
      console.error("Failed to update interval:", err);
      ToastNotification.error("Failed to update interval. Please try again.");
    } finally {
      setSaving((prev) => ({ ...prev, [s.roId]: false }));
    }
  };

  /* ---------- Next Order DATE handlers ---------- */
  const handleDateChange = (s, value) => {
    setPendingDate((prev) => ({ ...prev, [s.roId]: value }));
  };

  const handleSaveDate = async (s) => {
    const val = pendingDate[s.roId];
    if (!val) return;

    setSavingDate((prev) => ({ ...prev, [s.roId]: true }));
    try {
      const token = await getAccessTokenSilently();
      await api.patch(
        endpoint.UPDATE_RECURRING_ORDER(s.roId),
        { custrecord_ro_next_run: val }, // backend field for next order date
        { headers: { Authorization: `Bearer ${token}` } }
      );
      ToastNotification.success("Next order date updated.");
    } catch (err) {
      console.error("Failed to update next order date:", err);
      ToastNotification.error("Failed to update date. Please try again.");
    } finally {
      setSavingDate((prev) => ({ ...prev, [s.roId]: false }));
    }
  };

  /* ---------- Status (Active/Pause/Cancel) handlers ---------- */
  const handleStatusChange = (s, value) => {
    setPendingStatus((prev) => ({ ...prev, [s.roId]: value }));
  };

  const handleSaveStatus = async (s) => {
    const choice = pendingStatus[s.roId] || "active";

    // If user picked "Cancel", defer to the confirmation modal.
    if (choice === "canceled") {
      setConfirming(s);
      return;
    }

    // Otherwise: patch Active or Paused
    setSavingStatus((prev) => ({ ...prev, [s.roId]: true }));
    try {
      const token = await getAccessTokenSilently();
      const payload = STATUS_PAYLOADS[choice];
      await api.patch(
        endpoint.UPDATE_RECURRING_ORDER(s.roId),
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      ToastNotification.success(
        choice === "paused" ? "Subscription paused." : "Subscription activated."
      );
    } catch (err) {
      console.error("Failed to update subscription status:", err);
      ToastNotification.error("Failed to update subscription status.");
    } finally {
      setSavingStatus((prev) => ({ ...prev, [s.roId]: false }));
    }
  };

  /** Actually cancel (called by modal confirm) */
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
        // remove from list
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
        setPendingStatus((prev) => {
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
          const intervalNow = pending[s.roId] ?? s.interval;
          const isDirtyInterval = intervalNow !== s.interval;
          const isSavingInterval = !!saving[s.roId];

          const dateVal =
            pendingDate[s.roId] || toInputDate(nextFromToday(s.interval));
          const isSavingNextDate = !!savingDate[s.roId];

          const statusVal = pendingStatus[s.roId] || "active";
          const isSavingThisStatus = !!savingStatus[s.roId];

          return (
            <div key={s.roId} className="flex items-start gap-4 border rounded-md p-3">
              <ProductImage
                src={s.file_url}
                alt={s.displayname || s.itemid || "Product"}
                className="w-16 h-16 object-contain border rounded"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-semibold text-gray-800">
                    {s.displayname || s.itemid || `#${s.productId || s.roId}`}
                  </div>
                </div>

                {/* Interval (readable) */}
                <Paragraph className="mt-1 text-sm text-gray-600">
                  Interval: {intervalNow === "1" ? "Every 1 month" : `Every ${intervalNow} months`}
                </Paragraph>

                {/* Next Order: editable date picker */}
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-gray-500">Next Order:</span>
                  <input
                    type="date"
                    className={`${CTRL_SIZE} border rounded px-2 text-xs`}
                    value={dateVal}
                    onChange={(e) => handleDateChange(s, e.target.value)}
                    aria-label="Choose next order date"
                  />
                  <Button
                    variant="ghost"
                    className={`${BTN_TIGHT} border border-gray-300 text-gray-700 hover:bg-gray-50`}
                    onClick={() => handleSaveDate(s)}
                    disabled={isSavingNextDate || isSavingInterval || isSavingThisStatus}
                  >
                    {isSavingNextDate ? "Saving..." : "Save"}
                  </Button>
                  <span className="text-[11px] text-gray-400">
                    ({formatLocalDateToronto(new Date(dateVal))})
                  </span>
                </div>

                {/* Estimated delivery */}
                <Paragraph className="text-xs text-gray-500 mt-1">
                  Estimated Delivery: <span className="font-medium">5 Days</span>
                </Paragraph>

                {/* Controls row */}
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {/* Change interval */}
                  <div className="w-44">
                    <Dropdown
                      label="Change interval"
                      value={intervalNow}
                      onChange={(e) => handleIntervalChange(s, e.target.value)}
                      options={INTERVAL_OPTIONS}
                      className={`${CTRL_SIZE} py-0`}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    className={`${BTN_TIGHT} border border-gray-300 text-gray-700 hover:bg-gray-50`}
                    disabled={!isDirtyInterval || isSavingInterval || isSavingNextDate || isSavingThisStatus}
                    onClick={() => handleSaveInterval(s)}
                  >
                    {isSavingInterval ? "Saving..." : "Save"}
                  </Button>

                  {/* Subscription status (Active / Pause / Cancel) */}
                  <div className="w-56 ml-auto md:ml-6">
                    <Dropdown
                      label="Subscription"
                      value={statusVal}
                      onChange={(e) => handleStatusChange(s, e.target.value)}
                      options={STATUS_OPTIONS}
                      className={`${CTRL_SIZE} py-0`}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    className={`${BTN_TIGHT} border border-gray-300 text-gray-700 hover:bg-gray-50`}
                    disabled={isSavingInterval || isSavingNextDate || isSavingThisStatus}
                    onClick={() => handleSaveStatus(s)}
                  >
                    {isSavingThisStatus ? "Saving..." : "Save"}
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
