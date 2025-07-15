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
    } catch { }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: loadCartFromStorage(),
        status: STATUS.IDLE,
        error: null,
    },
    reducers: {
        addToCart: (state, action) => {
            const { id, flavor, quantity } = action.payload;
            let existing;

            if (flavor !== undefined) {
                existing = state.items.find(item => item.id === id && item.flavor === flavor);
            } else {
                existing = state.items.find(item => item.id === id);
            }

            if (existing) {
                existing.quantity += quantity;
            } else {
                state.items.push({ ...action.payload, quantity });
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

        // ✅ NEW reducer for updating quantity
        updateQuantity: (state, action) => {
            const { id, flavor, quantity } = action.payload;
            let item;

            if (flavor !== undefined) {
                item = state.items.find(i => i.id === id && i.flavor === flavor);
            } else {
                item = state.items.find(i => i.id === id);
            }

            if (item && quantity > 0) {
                item.quantity = quantity;
            }

            saveCartToStorage(state.items);
        }
    },
});

export const {
    addToCart,
    removeFromCart,
    clearCart,
    loadCart,
    updateQuantity, // ✅ now exported
} = cartSlice.actions;

export default cartSlice.reducer;
