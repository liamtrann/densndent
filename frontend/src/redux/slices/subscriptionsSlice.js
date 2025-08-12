// src/store/slices/subscriptionsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const LS_KEY = "dnd_subscriptions_v1";

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

// Each subscription: { id, itemid, displayname, file_url, flavor, interval, createdAt }
const initialState = {
  items: loadFromLS(),
};

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    upsertSubscription: (state, action) => {
      const { id, itemid, displayname, file_url, flavor = null, interval = "1" } = action.payload || {};
      if (!id) return;

      const keyMatch = (s) => s.id === id && (s.flavor || null) === (flavor || null);
      const existingIdx = state.items.findIndex(keyMatch);
      if (existingIdx >= 0) {
        // update interval only; preserve original createdAt
        state.items[existingIdx].interval = interval || state.items[existingIdx].interval || "1";
      } else {
        state.items.push({
          id,
          itemid,
          displayname,
          file_url,
          flavor: flavor || null,
          interval: interval || "1",
          createdAt: Date.now(),
        });
      }
      saveToLS(state.items);
    },

    updateSubscriptionInterval: (state, action) => {
      const { id, flavor = null, interval } = action.payload || {};
      const idx = state.items.findIndex((s) => s.id === id && (s.flavor || null) === (flavor || null));
      if (idx >= 0) {
        state.items[idx].interval = interval;
        saveToLS(state.items);
      }
    },

    cancelSubscription: (state, action) => {
      const { id, flavor = null } = action.payload || {};
      state.items = state.items.filter((s) => !(s.id === id && (s.flavor || null) === (flavor || null)));
      saveToLS(state.items);
    },
    // optional: clear all (not used in UI)
    clearSubscriptions: (state) => {
      state.items = [];
      saveToLS(state.items);
    },
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
