// src/hooks/useSubscriptionsList.js
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, useCallback } from "react";
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

  // Single pending state object for all changes
  const [pending, setPending] = useState({});

  // baselines to detect dirty fields after initial load
  const [initialData, setInitialData] = useState({});

  const [savingRow, setSavingRow] = useState({});
  const [savingStatus, setSavingStatus] = useState({});
  const [confirming, setConfirming] = useState(null);

  const userInfo = useSelector((state) => state.user.info);
  const { getAccessTokenSilently } = useAuth0();

  // Extract load function so it can be reused
  const load = useCallback(async () => {
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

      setItems(subs);

      // Initialize single pending state and baseline data
      const initData = {};
      const initPending = {};
      subs.forEach((s) => {
        const roId = s.roId;
        const fromApi = dateMap[roId];
        const nextRunDate =
          fromApi || DateUtils.toInput(nextFromToday(s.interval));
        const status = statusMap[roId] || "active";
        const deliveryDays = deliveryMap[roId] || [];

        // Store baseline data
        initData[roId] = {
          interval: s.interval,
          date: nextRunDate,
          status: status,
          deliveryDays: deliveryDays,
        };

        // Initialize pending state with current values
        initPending[roId] = {
          interval: s.interval,
          date: nextRunDate,
          status: status,
          deliveryDays: deliveryDays,
        };
      });

      setInitialData(initData);
      setPending(initPending);

      // Hydrate PDP titles/images
      const hydrated = await enrichSubscriptionsWithPdp(subs);
      setItems(hydrated);
      
    } catch (err) {
      console.error("Error loading subscriptions:", err);
      ToastNotification.error("Failed to load subscriptions.");
      setItems([]);
      setPending({});
      setInitialData({});
    } finally {
      setLoading(false);
    }
  }, [userInfo?.id, getAccessTokenSilently]);

  useEffect(() => {
    load();
  }, [load]);

  /* ---------- Handlers ---------- */
  const handleIntervalChange = (s, value) =>
    setPending((prev) => ({
      ...prev,
      [s.roId]: { ...prev[s.roId], interval: value },
    }));

  const handleDateChange = (s, value) =>
    setPending((prev) => ({
      ...prev,
      [s.roId]: { ...prev[s.roId], date: value },
    }));

  const handleStatusChange = (s, value) =>
    setPending((prev) => ({
      ...prev,
      [s.roId]: { ...prev[s.roId], status: value },
    }));

  const handleDeliveryChange = (s, value) =>
    setPending((prev) => ({
      ...prev,
      [s.roId]: { ...prev[s.roId], deliveryDays: value },
    }));

  /** Single bottom SAVE — saves interval + next date + status + delivery days together */
  const handleSaveAll = async (s) => {
    const roId = s.roId;

    const currentPending = pending[roId] || {};
    const currentInitial = initialData[roId] || {};

    const intervalNow = currentPending.interval ?? s.interval;
    const isDirtyInterval = intervalNow !== s.interval;

    const dateVal = currentPending.date ?? currentInitial.date;
    const baselineDate = currentInitial.date;
    const isDirtyDate = !!dateVal && dateVal !== baselineDate;

    const statusVal =
      currentPending.status ?? currentInitial.status ?? "active";
    const isDirtyStatus =
      (currentInitial.status ?? "active") !== (statusVal ?? "active");

    const deliveryVal =
      currentPending.deliveryDays ?? currentInitial.deliveryDays ?? [];
    const baselineDelivery = currentInitial.deliveryDays ?? [];
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

      // Refresh data by calling the load function again
      await load();

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
        // Refresh data by calling the load function again
        await load();
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
    initialData,
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
