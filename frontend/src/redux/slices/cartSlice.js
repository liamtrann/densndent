import { createSlice } from '@reduxjs/toolkit';
import { STATUS } from '../status';

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
  } catch {}
};

const initialState = {
  items: loadCartFromStorage(),
  status: STATUS.IDLE,
  error: null,
};

const findItem = (list, { id, flavor }) =>
  flavor !== undefined
    ? list.find(i => i.id === id && i.flavor === flavor)
    : list.find(i => i.id === id);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, flavor, quantity } = action.payload;
      const existing = findItem(state.items, { id, flavor });

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          ...action.payload,
          quantity,
          // subscription is OFF by default
          subscriptionEnabled: false,
          subscriptionInterval: null,
        });
      }
      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
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
      if (item && quantity > 0) item.quantity = quantity;
      saveCartToStorage(state.items);
    },

    // 🔽 toggle/assign subscription for a single item
    setItemSubscription: (state, action) => {
      const { id, flavor, enabled, interval } = action.payload;
      const item = findItem(state.items, { id, flavor });
      if (!item) return;

      item.subscriptionEnabled = !!enabled;
      item.subscriptionInterval = enabled ? (interval || '1') : null;

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
