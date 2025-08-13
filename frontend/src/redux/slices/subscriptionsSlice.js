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

// each subscription: { id, itemid, displayname, file_url, interval, createdAt }
const initialState = {
  items: loadFromLS(),
};

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
});

export const {
  upsertSubscription,
  updateSubscriptionInterval,
  cancelSubscription,
  clearSubscriptions,
} = subscriptionsSlice.actions;

export const selectSubscriptions = (state) => state.subscriptions?.items || [];

export default subscriptionsSlice.reducer;
