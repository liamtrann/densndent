// src/hooks/useSubscriptionsList.js
import { useAuth0 } from "@auth0/auth0-react"; //useAuth0() gives you getAccessTokenSilently() so you can call your API with an Authorization header.
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

import api from "api/api";
import endpoint from "api/endpoints";
import {
  normalizeSubscriptionRecord, //normalizeSubscriptionRecord → turns a messy record from NetSuite into a clean shape { roId, interval, displayname, file_url, ... }
  nextFromToday, //compute a future date by adding N months.
  DateUtils, //date formatting helpers (e.g., to YYYY-MM-DD).
} from "config/config";
import {
  parseStatus, //“active” | “paused” | “canceled” from many possible field shapes.
  pickNextRunDate, //grab next run date from whichever field exists; returns "YYYY-MM-DD" or null
  enrichSubscriptionsWithPdp, //fetch PDP for each item to fill better title/image.
  STATUS_PAYLOADS, //the exact PATCH payloads your backend expects for status changes
  buildRecurringOrderPatch,
} from "config/subscriptions";

import ToastNotification from "@/common/toast/Toast"; //your toast helper to show success/error banners.

export default function useSubscriptionsList() {
  const [items, setItems] = useState([]); //the subscription rows for the page, and a simple loading flag.
  const [loading, setLoading] = useState(false);

  // Only track which rows are saving
  const [savingRow, setSavingRow] = useState({}); //a map { [roId]: true } while saving changes to that row (so you can disable its Save button).
  const [savingStatus, setSavingStatus] = useState({}); //a map used when canceling a subscription (so the confirm modal can show a spinner).
  const [confirming, setConfirming] = useState(null); //holds the row being canceled; if set, your confirm modal is open

  const userInfo = useSelector((state) => state.user.info); //current user (for customerId) and the function to mint an access token
  const { getAccessTokenSilently } = useAuth0();

  // Extract load function so it can be reused
  const load = useCallback(async () => {
    if (!userInfo?.id) return; //if no logged-in user, bail
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const res = await api.get(
        endpoint.GET_RECURRING_ORDERS_BY_CUSTOMER({ //call your “recurring orders by customer” endpoint; timestamp busts caches.
          customerId: userInfo.id,
          timestamp: Date.now(),
        }),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const raw = res.data || [];

      // Normalize + exclude canceled
      const activeOrPaused = raw.filter((r) => parseStatus(r) !== "canceled"); //drop canceled rows for the list view
      const subs = activeOrPaused.map(normalizeSubscriptionRecord); //normalize every row to a predictable shape

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
            deliveryDays = rawRecord.preferdelivery //read preferdelivery (backend sends it as a comma string), turn it into an array of ints [1..7] (Mon..Sun or whatever your mapping is).
              .split(",")
              .map((day) => parseInt(day.trim()))
              .filter((day) => !isNaN(day) && day >= 1 && day <= 7);
          } catch (e) {
            deliveryDays = [];
          }
        }

        return {
          ...s,
          status: parseStatus(rawRecord) || "active", //compute status and nextrun (use a fallback date if missing).
          nextrun:
            pickNextRunDate(rawRecord) ||
            DateUtils.toInput(nextFromToday(s.interval)),
          deliveryDays: deliveryDays,
        };
      });

      setItems(enrichedSubs);

      // Hydrate PDP titles/images
      const hydrated = await enrichSubscriptionsWithPdp(enrichedSubs); //then, in the background, call PDP for each product id to fill nicer displayname/itemid/file_url
      setItems(hydrated); //when that finishes, update the list again so titles/images improve
    } catch (err) {
      console.error("Error loading subscriptions:", err);
      ToastNotification.error("Failed to load subscriptions.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [userInfo?.id, getAccessTokenSilently]);

  useEffect(() => { //one place that decides when to fetch data
    load();
  }, [load]);

  /* ---------- Handlers ---------- */
  /** Save form data from React Hook Form */
  const handleSaveSubscription = async (subscription, formData) => {
    const roId = subscription.roId;

    // Check if canceling
    if (formData.status === "canceled") {
      setConfirming(subscription);
      return;
    }

    // Build payload with only changed fields
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
      includePreferredDelivery: true, //includePreferredDelivery: true tells the builder to attach whatever backend shape your API needs for the “preferred delivery” field so it always persists correctly.
    });

    setSavingRow((prev) => ({ ...prev, [roId]: true }));
    try {
      const token = await getAccessTokenSilently();
      await api.patch(endpoint.UPDATE_RECURRING_ORDER(roId), payload, { //show a spinner on that row; PATCH; then call load() to refresh everything; toast success; clear spinner.
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
  const performCancel = async (s) => { //sends the standard “canceled” payload; reloads on success; manages modal/spinner/notifications.
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
