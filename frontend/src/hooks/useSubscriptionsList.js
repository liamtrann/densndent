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

  // Only track which rows are saving
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

     
      const activeOrPaused = raw.filter((r) => parseStatus(r) !== "canceled");
      const subs = activeOrPaused.map(normalizeSubscriptionRecord);

      // Enrich subscriptions with additional data
      const enrichedSubs = subs.map((s) => {
        const rawRecord = activeOrPaused.find(
          (r) => (r.id ?? r.internalid ?? r.roId) === s.roId
        );

        // Parse delivery days from preferdelivery field
        let deliveryDays = [];
        if (rawRecord?.preferdelivery) {
          try {
            // Handle comma-separated string format like "1, 3, 4, 5"
            deliveryDays = rawRecord.preferdelivery
              .split(",")
              .map((day) => parseInt(day.trim()))
              .filter((day) => !isNaN(day) && day >= 1 && day <= 7);
          } catch (e) {
            deliveryDays = [];
          }
        }

        return {
          ...s,
          status: parseStatus(rawRecord) || "active",
          nextrun:
            pickNextRunDate(rawRecord) ||
            DateUtils.toInput(nextFromToday(s.interval)),
          deliveryDays: deliveryDays,
        };
      });

      setItems(enrichedSubs);

      // Hydrate PDP titles/images
      const hydrated = await enrichSubscriptionsWithPdp(enrichedSubs);
      setItems(hydrated);
    } catch (err) {
      console.error("Error loading subscriptions:", err);
      ToastNotification.error("Failed to load subscriptions.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [userInfo?.id, getAccessTokenSilently]);

  useEffect(() => {
    load();
  }, [load]);

  
  const handleSaveSubscription = async (subscription, formData) => {
    const roId = subscription.roId;

    if (formData.status === "canceled") {
      setConfirming(subscription);
      return;
    }

    const payload = buildRecurringOrderPatch({
      interval:
        formData.interval !== subscription.interval
          ? formData.interval
          : undefined,
      date: formData.date !== subscription.nextrun ? formData.date : undefined,
      status:
        formData.status !== subscription.status ? formData.status : undefined,
      deliveryDays:
        JSON.stringify(formData.deliveryDays) !==
        JSON.stringify(subscription.deliveryDays)
          ? formData.deliveryDays
          : undefined,
      includePreferredDelivery: true,
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
    // state
    savingRow,
    savingStatus,
    confirming,
    // handlers
    handleSaveSubscription,
    performCancel,
    setConfirming,
  };
}
