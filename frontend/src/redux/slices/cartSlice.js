// src/redux/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../status';

// ---------- storage helpers ----------
const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('cart', JSON.stringify(items));
  } catch { }
};

// ---------- utils ----------
const findItem = (list, { id, flavor }) =>
  flavor !== undefined
    ? list.find((i) => i.id === id && i.flavor === flavor)
    : list.find((i) => i.id === id);

// normalize subscription payload & defaults
const normalizeSubscription = (payload = {}) => {
  const {
    subscriptionEnabled = false,             // on/off
    subscriptionInterval = null,             // '1', '2', '3', '6', etc.
    subscriptionUnit = 'Months',              // 'month' | 'week' | 'day' (if you ever expand)
    // You can add more optional fields later:
    // subscriptionStartDate = null,
    // subscriptionDiscount = null,
  } = payload;

  // if not enabled, we null out interval for clarity
  return subscriptionEnabled
    ? { subscriptionEnabled: true, subscriptionInterval: String(subscriptionInterval || '1'), subscriptionUnit }
    : { subscriptionEnabled: false, subscriptionInterval: null, subscriptionUnit };
};

// ---------- slice ----------
const cartSlice = createSlice({
  name: 'Cart',
  initialState: {
    items: loadCartFromStorage(),
    status: STATUS.IDLE,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const { id, flavor, quantity = 1, ...rest } = action.payload;

      // figure out if we already have this variant in cart
      const existing = findItem(state.items, { id, flavor });

      // normalize incoming subscription fields (or defaults)
      const sub = normalizeSubscription(rest);

      if (existing) {
        // quantity: add to existing
        existing.quantity += quantity;

        // if caller explicitly provided subscription fields, update them
        if (rest.hasOwnProperty('subscriptionEnabled')) {
          existing.subscriptionEnabled = sub.subscriptionEnabled;
          existing.subscriptionInterval = sub.subscriptionInterval;
          existing.subscriptionUnit = sub.subscriptionUnit;
        }
      } else {
        // push brand new item with normalized subscription fields
        state.items.push({
          ...action.payload,
          quantity,
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
      const { id, flavor, quantity } = action.payload;
      const item = findItem(state.items, { id, flavor });
      if (item && quantity > 0) {
        item.quantity = quantity;
        saveCartToStorage(state.items);
      }
    },

    // Toggle/assign subscription for a single item (used in Cart Page / Panel)
    setItemSubscription: (state, action) => {
      const { id, flavor, enabled, interval, unit } = action.payload;
      const item = findItem(state.items, { id, flavor });
      if (!item) return;

      const sub = normalizeSubscription({
        subscriptionEnabled: enabled,
        subscriptionInterval: interval ?? item.subscriptionInterval ?? '1',
        subscriptionUnit: unit ?? item.subscriptionUnit ?? 'month',
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
