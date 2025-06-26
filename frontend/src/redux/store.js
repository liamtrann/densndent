import { configureStore } from '@reduxjs/toolkit';
import { cartReducer, bestSellers } from './slices';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        bestSellers,
    },
});

export default store;
