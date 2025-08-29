// src/hooks/useSubscriptionsList.js
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import api from "api/api";
import endpoint from "api/endpoints";
import {
  normalizeSubscriptionRecord,
  nextFromToday,
  DateUtils,
} from "config/config";
import {
  parseStatus,
  pickNextRunDate,
  enrichSubscriptionsWithPdp,
  STATUS_PAYLOADS,
  buildRecurringOrderPatch,
} from "config/subscriptions";

import ToastNotification from "@/common/toast/Toast";

export default function useSubscriptionsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // per-row working state
  const [pending, setPending] = useState({}); // interval
  const [pendingDate, setPendingDate] = useState({}); // yyyy-mm-dd
  const [pendingStatus, setPendingStatus] = useState({}); // active/paused/canceled
  const [pendingDelivery, setPendingDelivery] = useState({}); // preferred delivery days

  // baselines to detect dirty fields after initial load
  const [initialStatus, setInitialStatus] = useState({});
  const [initialDate, setInitialDate] = useState({}); // yyyy-mm-dd baseline
  const [initialDelivery, setInitialDelivery] = useState({}); // delivery days baseline

  const [savingRow, setSavingRow] = useState({});
  const [savingStatus, setSavingStatus] = useState({});
  const [confirming, setConfirming] = useState(null);

  const userInfo = useSelector((state) => state.user.info);
  const { getAccessTokenSilently } = useAuth0();

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

        const raw = res.data || [];

        // Normalize + exclude canceled
        const activeOrPaused = raw.filter((r) => parseStatus(r) !== "canceled");
        const subs = activeOrPaused.map(normalizeSubscriptionRecord);

        // Build maps for status and next run date
        const statusMap = {};
        const dateMap = {};
        const deliveryMap = {};
        activeOrPaused.forEach((r) => {
          const roId = r.id ?? r.internalid ?? r.roId;
          statusMap[roId] = parseStatus(r);
          dateMap[roId] = pickNextRunDate(r);

          // Parse delivery days from preferdelivery field
          let deliveryDays = [];
          if (r.preferdelivery) {
            try {
              // Handle comma-separated string format like "1, 3, 4, 5"
              deliveryDays = r.preferdelivery
                .split(",")
                .map((day) => parseInt(day.trim()))
                .filter((day) => !isNaN(day) && day >= 1 && day <= 7);
            } catch (e) {
              deliveryDays = [];
            }
          }
          deliveryMap[roId] = deliveryDays;
        });

        if (!mounted) return;

        setItems(subs);

        // init interval working state
        const initIntervals = {};
        subs.forEach((s) => (initIntervals[s.roId] = s.interval));
        setPending(initIntervals);

        // init date baseline + working
        const initDates = {};
        subs.forEach((s) => {
          const fromApi = dateMap[s.roId];
          initDates[s.roId] =
            fromApi || DateUtils.toInput(nextFromToday(s.interval));
        });
        setInitialDate(initDates);
        setPendingDate(initDates);

        // init status baseline + working
        const initStatus = {};
        subs.forEach((s) => {
          initStatus[s.roId] = statusMap[s.roId] || "active";
        });
        setInitialStatus(initStatus);

        // init delivery days baseline + working
        const initDelivery = {};
        subs.forEach((s) => {
          initDelivery[s.roId] = deliveryMap[s.roId] || [];
        });
        setInitialDelivery(initDelivery);
        setPendingDelivery(initDelivery);

        // Hydrate PDP titles/images
        const hydrated = await enrichSubscriptionsWithPdp(subs);
        if (mounted) setItems(hydrated);
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

    console.log(items);

    load();
    return () => {
      mounted = false;
    };
  }, [userInfo?.id, getAccessTokenSilently]);

  /* ---------- Handlers ---------- */
  const handleIntervalChange = (s, value) =>
    setPending((prev) => ({ ...prev, [s.roId]: value }));

  const handleDateChange = (s, value) =>
    setPendingDate((prev) => ({ ...prev, [s.roId]: value }));

  const handleStatusChange = (s, value) =>
    setPendingStatus((prev) => ({ ...prev, [s.roId]: value }));

  const handleDeliveryChange = (s, value) =>
    setPendingDelivery((prev) => ({ ...prev, [s.roId]: value }));

  /** Single bottom SAVE — saves interval + next date + status + delivery days together */
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

    const deliveryVal = pendingDelivery[roId] ?? initialDelivery[roId] ?? [];
    const baselineDelivery = initialDelivery[roId] ?? [];
    const isDirtyDelivery =
      JSON.stringify(deliveryVal) !== JSON.stringify(baselineDelivery);

    if (statusVal === "canceled") {
      setConfirming(s);
      return;
    }

    const payload = buildRecurringOrderPatch({
      interval: isDirtyInterval ? intervalNow : undefined,
      date: isDirtyDate ? dateVal : undefined,
      status: isDirtyStatus ? statusVal : undefined,
      deliveryDays: isDirtyDelivery ? deliveryVal : undefined,
      includePreferredDelivery: true, // required
    });

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
      if (isDirtyStatus) setInitialStatus((p) => ({ ...p, [roId]: statusVal }));
      if (isDirtyDate) setInitialDate((p) => ({ ...p, [roId]: dateVal }));
      if (isDirtyDelivery)
        setInitialDelivery((p) => ({ ...p, [roId]: deliveryVal }));

      ToastNotification.success("Subscription changes saved.");
    } catch (err) {
      console.error("Failed to save subscription changes:", err);
      ToastNotification.error("Failed to save. Please try again.");
    } finally {
      setSavingRow((prev) => ({ ...prev, [roId]: false }));
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
        setItems((prev) => prev.filter((it) => it.roId !== s.roId));
        setPending((p) => {
          const c = { ...p };
          delete c[s.roId];
          return c;
        });
        setPendingDate((p) => {
          const c = { ...p };
          delete c[s.roId];
          return c;
        });
        setInitialDate((p) => {
          const c = { ...p };
          delete c[s.roId];
          return c;
        });
        setPendingStatus((p) => {
          const c = { ...p };
          delete c[s.roId];
          return c;
        });
        setInitialStatus((p) => {
          const c = { ...p };
          delete c[s.roId];
          return c;
        });
        setPendingDelivery((p) => {
          const c = { ...p };
          delete c[s.roId];
          return c;
        });
        setInitialDelivery((p) => {
          const c = { ...p };
          delete c[s.roId];
          return c;
        });
        ToastNotification.success("Subscription canceled.");
      } else {
        throw new Error("Failed to cancel subscription");
      }
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
      ToastNotification.error(
        "Failed to cancel subscription. Please try again."
      );
    } finally {
      setSavingStatus((prev) => ({ ...prev, [s.roId]: false }));
      setConfirming(null);
    }
  };

  return {
    // data
    items,
    loading,
    // state maps
    pending,
    pendingDate,
    pendingStatus,
    pendingDelivery,
    initialDate,
    initialStatus,
    initialDelivery,
    savingRow,
    savingStatus,
    confirming,
    // handlers
    handleIntervalChange,
    handleDateChange,
    handleStatusChange,
    handleDeliveryChange,
    handleSaveAll,
    performCancel,
    setConfirming,
  };
}
