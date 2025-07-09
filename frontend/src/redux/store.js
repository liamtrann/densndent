import { configureStore } from '@reduxjs/toolkit';
import { cartReducer, bestSellers, classification, products, user } from './slices';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        bestSellers,
        classification,
        products,
        user,
    },
});

export default store;
