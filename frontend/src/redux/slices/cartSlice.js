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
            state.items.push(action.payload);
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
        }
    },
});

export const { addToCart, removeFromCart, clearCart, loadCart } = cartSlice.actions;
export default cartSlice.reducer;
