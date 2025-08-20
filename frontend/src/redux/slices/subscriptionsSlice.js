// src/redux/slices/subscriptionSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "api/api";
import endpoint from "api/endpoints";

/* ========== helpers used across thunks ========== */
const isCanceled = (rec) => {
  const val =
    rec?.custrecord_ro_status?.id ??
    rec?.custrecord_ro_status ??
    rec?.statusId ??
    rec?.status;
  return String(val) === "3";
};

const normalizeSub = (r) => {
  const roId = r.id ?? r.internalid ?? r.roId;
  const productId = r.itemId ?? r.item_id ?? r.productId;
  return {
    roId,
    productId,
    itemid:
      r.itemid ||
      r.itemName ||
      r.name ||
      r.displayname ||
      `#${productId || roId}`,
    displayname:
      r.displayname ||
      r.itemName ||
      r.name ||
      r.itemid ||
      `#${productId || roId}`,
    file_url: r.file_url || r.image || r.thumbnail || r.fileUrl || "",
    interval: String(
      r.interval || r.custrecord_ro_interval || r.recurringInterval || "1"
    ),
  };
};

/* ========== Thunks ========== */

/**
 * Load subscriptions for a customer (SuiteQL).
 */
export const fetchSubscriptionsForCustomer = createAsyncThunk(
  "subscriptions/fetchForCustomer",
  async ({ customerId, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      const token = getAccessTokenSilently
        ? await getAccessTokenSilently()
        : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const res = await api.get(
        endpoint.GET_RECURRING_ORDERS_BY_CUSTOMER({
          customerId,
          timestamp: Date.now(),
        }),
        { headers }
      );

      const raw = res.data?.items || res.data || [];
      const activeOnly = raw.filter((r) => !isCanceled(r));
      return activeOnly.map(normalizeSub);
    } catch (err) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

/**
 * Update interval for a recurring-order record (REST PATCH).
 */
export const updateSubscriptionIntervalOnServer = createAsyncThunk(
  "subscriptions/updateInterval",
  async ({ roId, interval, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      const token = getAccessTokenSilently
        ? await getAccessTokenSilently()
        : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      await api.patch(
        endpoint.SET_RECURRING_ORDER_INTERVAL(roId),
        { custrecord_ro_interval: Number(interval) },
        { headers }
      );

      return { roId, interval: String(interval) };
    } catch (err) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

/**
 * Cancel a recurring-order (REST PATCH).
 */
export const cancelSubscriptionOnServer = createAsyncThunk(
  "subscriptions/cancel",
  async ({ roId, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      const token = getAccessTokenSilently
        ? await getAccessTokenSilently()
        : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      await api.patch(
        endpoint.CANCEL_RECURRING_ORDER(roId),
        { custrecord_ro_status: { id: "3" } },
        { headers }
      );

      return { roId };
    } catch (err) {
      return rejectWithValue(err?.response?.data || err?.message);
    }
  }
);

/* ========== Slice ========== */

const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState: {
    items: [], // [{ roId, productId, displayname, itemid, file_url, interval }]
    status: "idle",
    error: null,
  },
  reducers: {
    clearSubscriptions(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchSubscriptionsForCustomer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubscriptionsForCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
      })
      .addCase(fetchSubscriptionsForCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load subscriptions";
      })

      // update interval
      .addCase(
        updateSubscriptionIntervalOnServer.fulfilled,
        (state, action) => {
          const { roId, interval } = action.payload || {};
          const idx = state.items.findIndex((s) => s.roId === roId);
          if (idx >= 0) state.items[idx].interval = interval;
        }
      )

      // cancel
      .addCase(cancelSubscriptionOnServer.fulfilled, (state, action) => {
        const { roId } = action.payload || {};
        state.items = state.items.filter((s) => s.roId !== roId);
      });
  },
});

export const { clearSubscriptions } = subscriptionSlice.actions;

export const selectSubscriptions = (state) => state.subscriptions.items;
export const selectSubscriptionsStatus = (state) => state.subscriptions.status;
export const selectSubscriptionsError = (state) => state.subscriptions.error;

export default subscriptionSlice.reducer;
