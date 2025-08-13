// src/redux/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../status";

// ---------- storage helpers ----------
const LS_KEY = "cart";

const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem(LS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {}
};

// ---------- utils ----------
// Find strictly by id (no variant/flavor support)
const findItem = (list, id) => list.find((i) => i.id === id);

// Normalize subscription fields to a consistent shape
const normalizeSubscription = (payload = {}) => {
  const {
    subscriptionEnabled = false,             // on/off
    subscriptionInterval = null,             // '1', '2', '3', '6', etc.
    subscriptionUnit = 'months',              // 'month' | 'week' | 'day' (if you ever expand)
    // You can add more optional fields later:
    // subscriptionStartDate = null,
    // subscriptionDiscount = null,
  } = payload;

  return subscriptionEnabled
    ? {
        subscriptionEnabled: true,
        subscriptionInterval: String(subscriptionInterval || "1"),
        subscriptionUnit,
      }
    : {
        subscriptionEnabled: false,
        subscriptionInterval: null,
        subscriptionUnit,
      };
};

// ---------- slice ----------
const cartSlice = createSlice({
  name: "Cart",
  initialState: {
    items: loadCartFromStorage(),
    status: STATUS.IDLE,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const { id, quantity: rawQty = 1, ...rest } = action.payload;

      // coerce quantity safely
      const qtyNum = Number(rawQty);
      const qty = Number.isFinite(qtyNum) && qtyNum > 0 ? qtyNum : 1;

      const existing = findItem(state.items, id);

      // normalize incoming subscription fields (or defaults)
      const sub = normalizeSubscription(rest);

      if (existing) {
        existing.quantity += qty;

        // if caller explicitly provided subscription fields, update them
        if (Object.prototype.hasOwnProperty.call(rest, "subscriptionEnabled")) {
          existing.subscriptionEnabled = sub.subscriptionEnabled;
          existing.subscriptionInterval = sub.subscriptionInterval;
          existing.subscriptionUnit = sub.subscriptionUnit;
        }
      } else {
        state.items.push({
          ...action.payload,
          quantity: qty,
          subscriptionEnabled: sub.subscriptionEnabled,
          subscriptionInterval: sub.subscriptionInterval,
          subscriptionUnit: sub.subscriptionUnit,
        });
      }

      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },

    loadCart: (state) => {
      state.items = loadCartFromStorage();
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const qtyNum = Number(quantity);
      const item = findItem(state.items, id);

      if (item && Number.isFinite(qtyNum) && qtyNum > 0) {
        item.quantity = qtyNum;
        saveCartToStorage(state.items);
      }
    },

    // Toggle/assign subscription for a single item (used in Cart Page / Panel)
    setItemSubscription: (state, action) => {
      const { id, enabled, interval, unit } = action.payload;
      const item = findItem(state.items, id);
      if (!item) return;

      const sub = normalizeSubscription({
        subscriptionEnabled: enabled,
        subscriptionInterval: interval ?? item.subscriptionInterval ?? '1',
        subscriptionUnit: unit ?? item.subscriptionUnit ?? 'months',
      });

      item.subscriptionEnabled = sub.subscriptionEnabled;
      item.subscriptionInterval = sub.subscriptionInterval;
      item.subscriptionUnit = sub.subscriptionUnit;

      saveCartToStorage(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  loadCart,
  updateQuantity,
  setItemSubscription,
} = cartSlice.actions;

export default cartSlice.reducer;
