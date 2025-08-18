// src/components/product/ListSubscriptions.jsx
import React, { useEffect, useState } from "react"; //these imports power the whole “Subscription List” page: the list items, the image, the interval
import { Button, Dropdown, Paragraph, ProductImage } from "common";
import api from "api/api";
import endpoint from "api/endpoints";
import { useSelector } from "react-redux"; //where things come from 

const INTERVAL_OPTIONS = [ //Options for the interval <Dropdown>
  { value: "1", label: "Every 1 month" },
  { value: "2", label: "Every 2 months" },
  { value: "3", label: "Every 3 months" },
  { value: "6", label: "Every 6 months" },
];

function daysInMonth(year, monthIndex) { //Date helpers
  return new Date(year, monthIndex + 1, 0).getDate();
}

function addMonthsSafe(date, months) {  //Adds months to a date safely, avoiding overflow and prevents bugs for “next delivery” dates.
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

function formatLocalDateToronto(date) { //Formats a Date to a short readable string in the Toronto time zone
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

function normalizeSub(r) { //the card title (“3D: Curved Utility Syringe …”), the image, and the “Interval: Every X months” line all come from this normalized object.
  const roId = r.id ?? r.internalid ?? r.roId; //Picks a recurring order id
  const productId = r.itemId ?? r.item_id ?? r.productId;
  return {
    roId,
    productId,
    itemid: r.itemid || r.itemName || r.name || r.displayname || `#${productId || roId}`,
    displayname: r.displayname || r.itemName || r.name || r.itemid || `#${productId || roId}`,
    file_url: r.file_url || r.image || r.thumbnail || r.fileUrl || "",
    interval: String(r.interval || r.custrecord_ro_interval || r.recurringInterval || "1"),
  };
}




const isCanceled = (rec) => { //tell me if this record is canceled, even if the API uses different fields/types
  const val = rec?.custrecord_ro_status?.id ?? rec?.custrecord_ro_status ?? rec?.statusId ?? rec?.status;
  return String(val) === "3";
};

export default function ListSubscriptions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState({});
  const [saving, setSaving] = useState({});
  const [canceling, setCanceling] = useState({});
  const userInfo = useSelector((state) => state.user.info); //id to fetch that user’s subscriptions

  useEffect(() => { //Fetch subscriptions
    let mounted = true; //fetch GET_RECURRING_ORDERS_BY_CUSTOMER(customerId)
    async function load() {
      if (!userInfo?.id) return; //If we don’t have a user ID yet, do nothing
      setLoading(true);
      try {
        const res = await api.get( //Calls backend endpoint to list recurring orders for this user
          endpoint.GET_RECURRING_ORDERS_BY_CUSTOMER({ //a SuiteQL endpoint listing all recurring orders for the user
            customerId: userInfo.id,
            timestamp: new Date().getTime()
          })
        );
        const raw = res.data?.items || res.data || [];
        const activeOnly = raw.filter((r) => !isCanceled(r));
        const subs = activeOnly.map(normalizeSub);

        if (mounted) {
          setItems(subs);
          const init = {};
          subs.forEach((s) => (init[s.roId] = s.interval));
          setPending(init);
        }
      } catch (err) {
        console.error("Error loading subscriptions:", err);
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [userInfo?.id]);

  const handleIntervalChange = (s, value) => { //you select “Every 2 months” → the Save button in that row turns active
    setPending((prev) => ({ ...prev, [s.roId]: value }));
  };

  const handleSaveInterval = async (s) => {
    const selected = pending[s.roId];
    if (!selected || selected === s.interval) return;

    setSaving((prev) => ({ ...prev, [s.roId]: true })); //Interval: Every X months” and the Next delivery (computed from the saved value) match.
    try {
      await api.patch(endpoint.SET_RECURRING_ORDER_INTERVAL(s.roId), {
        custrecord_ro_interval: Number(selected),
      });
      setItems((prev) =>
        prev.map((it) =>
          it.roId === s.roId ? { ...it, interval: String(selected) } : it
        )
      );
    } catch (err) {
      console.error("Failed to update interval:", err);
      alert("Failed to update interval. Please try again.");
    } finally {
      setSaving((prev) => ({ ...prev, [s.roId]: false })); //, the Save button shows “Saving…” and disables
    }
  };


  //------------------------------------------------------------------
  const handleCancel = async (s) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) return;


    console.log("Canceling subscription:", s);
    setCanceling((prev) => ({ ...prev, [s.roId]: true }));
    try {
      const response = await api.patch(endpoint.CANCEL_RECURRING_ORDER(s.roId), {
        custrecord_ro_status: { id: "3" }, //Confirms with the user, then with status { id: "3" } (your “Canceled” code).
      });

      console.log(response)

      if (response.status >= 200 && response.status < 300) {
        setItems((prev) => prev.filter((it) => it.roId !== s.roId));
        setPending((prev) => {
          const cp = { ...prev };
          delete cp[s.roId];
          return cp;
        });
        alert("Subscription canceled successfully"); //On success we remove the row immediately from items
      } else {
        throw new Error("Failed to cancel subscription");
      }
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setCanceling((prev) => ({ ...prev, [s.roId]: false }));
    }
  };

//-----------------------------------------------------------------------------

  if (loading && items.length === 0) {
    return <div className="text-center py-12"><Paragraph>Loading subscriptions...</Paragraph></div>; //Before data arrives: you see the centered “Loading” block.
  }

  if (!items.length) { ////After fetch, if nothing is active: you see the “No active subscriptions” block
    return (
      <div className="text-center py-12"> 
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No active subscriptions</h3> 
        <Paragraph className="text-gray-500">
          Subscribe to products on their detail pages to see them here.
        </Paragraph>
      </div>
    ); //you don’t see these now because you have 5 active subs; they show only when appropriate.
  }

  return (
    <div className="space-y-4">
      {items.map((s) => {
      const intervalNow = pending[s.roId] ?? s.interval;    // value shown in the dropdown
      const nextDate = nextFromToday(s.interval);            // based on the SAVED interval
      const isDirty = intervalNow !== s.interval;            // Save enabled only if changed
      const isSaving = !!saving[s.roId];
      const isCanceling = !!canceling[s.roId];

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
                    value={intervalNow}
                    onChange={(e) => handleIntervalChange(s, e.target.value)}
                    options={INTERVAL_OPTIONS}
                    className="h-10"
                  />
                </div>
                <Button
                  variant="ghost" //ghost = a subtle, neutral button
                  className="h-10 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={!isDirty || isSaving || isCanceling}
                  onClick={() => handleSaveInterval(s)}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="dangerGhost" //the same “ghost” treatment but in a destructive theme.
                  className="h-10 px-4 whitespace-nowrap font-normal"
                  disabled={isSaving || isCanceling}
                  onClick={() => handleCancel(s)}
                >
                  {isCanceling ? "Canceling..." : "Cancel subscription"}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}