// src/redux/slices/subscriptionsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "api/api";
import endpoint from "api/endpoints";

const LS_KEY = "dnd_subscriptions_v1";

/* ===== local storage helpers ===== */
function loadFromLS() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveToLS(items) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {}
}

/* ===== date helpers ===== */
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
function nextFromToday(intervalStr) {
  const n = parseInt(intervalStr || "1", 10);
  return addMonthsSafe(new Date(), Number.isFinite(n) ? n : 1);
}

/* ===== state ===== */
const initialState = {
  items: loadFromLS(),   // [{ id, itemid, displayname, file_url, interval, createdAt }]
  status: "idle",
  error: null,
};

/**
 * Create subscriptions for subscribed cart items after checkout.
 * Tries backend (POST_RECURRING_ORDER) but always upserts locally so UI updates.
 */
export const createSubscriptionsFromCart = createAsyncThunk(
  "subscriptions/createFromCart",
  async ({ cartItems, customerId, getAccessTokenSilently }, { dispatch, rejectWithValue }) => {
    try {
      const token = getAccessTokenSilently ? await getAccessTokenSilently() : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const subscribedItems = (cartItems || []).filter((it) => it.subscriptionEnabled);

      for (const it of subscribedItems) {
        const interval = String(it.subscriptionInterval || "1");
        const unit = it.subscriptionUnit || "months";
        const firstDelivery = nextFromToday(interval);

        // Try backend (ignore errors so UI still updates)
        try {
          await api.post(
            endpoint.POST_RECURRING_ORDER(),
            {
              customerId,
              itemId: it.id,
              interval,
              unit,
              quantity: it.quantity || 1,
              nextDeliveryDate: firstDelivery.toISOString().slice(0, 10), // YYYY-MM-DD
            },
            { headers }
          );
        } catch (_) {}

        // Local upsert so the Subscriptions tab updates immediately
        dispatch(
          upsertSubscription({
            id: it.id,
            itemid: it.itemid,
            displayname: it.displayname || it.itemid,
            file_url: it.file_url,
            interval,
          })
        );
      }

      return { count: subscribedItems.length };
    } catch (err) {
      return rejectWithValue(err?.response?.data || err?.message || "Failed to create subscriptions");
    }
  }
);

/**
 * Fetch subscriptions for the current customer from backend.
 * Uses SuiteQL: endpoint.GET_RECURRING_ORDERS_BY_CUSTOMER.
 */
export const fetchSubscriptionsForCustomer = createAsyncThunk(
  "subscriptions/fetchByCustomer",
  async ({ customerId, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      if (!customerId) return [];
      const token = getAccessTokenSilently ? await getAccessTokenSilently() : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const url = endpoint.GET_RECURRING_ORDERS_BY_CUSTOMER({ customerId });
      const res = await api.get(url, { headers });

      // Normalize flexible backend shapes -> our UI shape
      const raw = res.data?.items || res.data || [];
      const normalized = (Array.isArray(raw) ? raw : []).map((r) => ({
        id: r.itemId || r.item_id || r.id,
        itemid: r.itemid || r.itemName || r.name || r.displayname || `#${r.itemId || r.id}`,
        displayname: r.displayname || r.itemName || r.name || r.itemid || `#${r.itemId || r.id}`,
        file_url: r.file_url || r.image || r.thumbnail || "",
        interval: String(r.interval || r.recurringInterval || "1"),
        createdAt: Date.now(),
      }));

      return normalized;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err?.message || "Failed to fetch subscriptions");
    }
  }
);

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    upsertSubscription: (state, action) => {
      const { id, itemid, displayname, file_url, interval = "1" } = action.payload || {};
      if (!id) return;

      const idx = state.items.findIndex((s) => s.id === id);
      if (idx >= 0) {
        state.items[idx].interval = String(interval || state.items[idx].interval || "1");
      } else {
        state.items.push({
          id,
          itemid,
          displayname,
          file_url,
          interval: String(interval || "1"),
          createdAt: Date.now(),
        });
      }
      saveToLS(state.items);
    },

    updateSubscriptionInterval: (state, action) => {
      const { id, interval } = action.payload || {};
      const idx = state.items.findIndex((s) => s.id === id);
      if (idx >= 0) {
        state.items[idx].interval = String(interval || "1");
        saveToLS(state.items);
      }
    },

    cancelSubscription: (state, action) => {
      const { id } = action.payload || {};
      state.items = state.items.filter((s) => s.id !== id);
      saveToLS(state.items);
    },

    clearSubscriptions: (state) => {
      state.items = [];
      saveToLS(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubscriptionsFromCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createSubscriptionsFromCart.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createSubscriptionsFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create subscriptions";
      })
      .addCase(fetchSubscriptionsForCustomer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubscriptionsForCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Replace with backend truth; dedupe by id
        const byId = new Map();
        [...action.payload].forEach((s) => byId.set(s.id, s));
        state.items = Array.from(byId.values());
        saveToLS(state.items);
      })
      .addCase(fetchSubscriptionsForCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch subscriptions";
      });
  },
});

export const {
  upsertSubscription,
  updateSubscriptionInterval,
  cancelSubscription,
  clearSubscriptions,
} = subscriptionsSlice.actions;

export const selectSubscriptions = (state) => state.subscriptions?.items || [];

export default subscriptionsSlice.reducer;
