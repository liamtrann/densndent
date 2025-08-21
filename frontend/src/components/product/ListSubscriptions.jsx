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

export default function ListSubscriptions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // per-row states
  const [pending, setPending] = useState({}); // { [roId]: "1"|"2"|"3"|"6" }
  const [saving, setSaving] = useState({}); // { [roId]: boolean }
  const [canceling, setCanceling] = useState({}); // { [roId]: boolean }
  const [confirming, setConfirming] = useState(null); // the row we’re confirming

  const userInfo = useSelector((state) => state.user.info);
  const { getAccessTokenSilently } = useAuth0();

  /** Fetch subscriptions */
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!userInfo?.id) return;
      setLoading(true);
      try {
        const token = await getAccessTokenSilently(); // get the Auth0 access token and send it as Bearer
        const res = await api.get(
          endpoint.GET_RECURRING_ORDERS_BY_CUSTOMER({
            customerId: userInfo.id,
            timestamp: Date.now(),
          }),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const raw = res.data?.items || res.data || [];
        const activeOnly = raw.filter((r) => !isSubscriptionCanceled(r));
        const subs = activeOnly.map(normalizeSubscriptionRecord);

        if (mounted) {
          setItems(subs);
          const init = {};
          subs.forEach((s) => (init[s.roId] = s.interval));
          setPending(init);
        }
      } catch (err) {
        console.error("Error loading subscriptions:", err);
        ToastNotification.error("Failed to load subscriptions.");
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [userInfo?.id, getAccessTokenSilently]);

  const handleIntervalChange = (s, value) => {
    setPending((prev) => ({ ...prev, [s.roId]: value }));
  };

  const handleSaveInterval = async (s) => {
    const selected = pending[s.roId];
    if (!selected || selected === s.interval) return;

    setSaving((prev) => ({ ...prev, [s.roId]: true }));
    try {
      const token = await getAccessTokenSilently();  // include token on the interval update PATCH
      await api.patch(
        endpoint.SET_RECURRING_ORDER_INTERVAL(s.roId),
        buildIntervalPatchPayload(selected),
        { headers: { Authorization: `Bearer ${token}` } }  // ⬅️ token added here Bearer <token> is the standard way to send tokens.
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

  /** Actually cancel (called by modal confirm) */
  const performCancel = async (s) => {
    setCanceling((prev) => ({ ...prev, [s.roId]: true }));
    try {
      const token = await getAccessTokenSilently();
      const response = await api.patch(
        endpoint.UPDATE_RECURRING_ORDER(s.roId),
        SUBSCRIPTION_CANCEL_PAYLOAD,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setItems((prev) => prev.filter((it) => it.roId !== s.roId));
        setPending((prev) => {
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
      ToastNotification.error(
        "Failed to cancel subscription. Please try again."
      );
    } finally {
      setCanceling((prev) => ({ ...prev, [s.roId]: false }));
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
          const nextDate = nextFromToday(s.interval);
          const isDirty = intervalNow !== s.interval;
          const isSaving = !!saving[s.roId];
          const isCancelingRow = !!canceling[s.roId];

          return (
            <div
              key={s.roId}
              className="flex items-start gap-4 border rounded-md p-3"
            >
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
                <Paragraph className="mt-1 text-sm text-gray-600">
                  Interval:{" "}
                  {s.interval === "1"
                    ? "Every 1 month"
                    : `Every ${s.interval} months`}
                </Paragraph>
                <Paragraph className="text-xs text-gray-500 mt-1">
                  Next Order:{" "}
                  <span className="font-medium">
                    {formatLocalDateToronto(nextDate)}
                  </span>
                </Paragraph>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {/* <div className="w-48">
                    <Dropdown
                      label="Change interval"
                      value={intervalNow}
                      onChange={(e) => handleIntervalChange(s, e.target.value)}
                      options={INTERVAL_OPTIONS}
                      className="h-10"
                    />
                  </div> */}

                  {/* Save (ghost) */}
                  {/* <Button
                    variant="ghost"
                    className="h-10 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50"
                    disabled={!isDirty || isSaving || isCancelingRow}
                    onClick={() => handleSaveInterval(s)}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button> */}

                  {/* Cancel (ghost danger) -> modal */}
                  <Button
                    variant="dangerGhost"
                    className="h-10 px-4 whitespace-nowrap font-normal underline hover:no-underline"
                    disabled={isSaving || isCancelingRow}
                    onClick={() => setConfirming(s)}
                  >
                    {isCancelingRow ? "Cancelling..." : "Cancel subscription"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      <ConfirmCancelSubscription
        open={!!confirming}
        productTitle={confirming?.displayname || confirming?.itemid}
        loading={confirming ? !!canceling[confirming.roId] : false}
        onClose={() => setConfirming(null)}
        onConfirm={() => confirming && performCancel(confirming)}
      />
    </>
  );
}
