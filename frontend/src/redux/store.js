import { configureStore } from '@reduxjs/toolkit';
import { cartReducer, bestSellers } from './slices';
import classification from './slices/classificationSlice';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        bestSellers,
        classification,
    },
});

export default store;
