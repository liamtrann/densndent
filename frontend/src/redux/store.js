import { configureStore } from '@reduxjs/toolkit';
import { cartReducer, bestSellers, classification, products } from './slices';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        bestSellers,
        classification,
        products
    },
});

export default store;
