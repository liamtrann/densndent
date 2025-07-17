import { configureStore } from '@reduxjs/toolkit';

import { cartReducer, bestSellers, classification, products, user, itemPriceAfterDiscount } from './slices';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        bestSellers,
        classification,
        products,
        user,
        itemPriceAfterDiscount,
    },
});

export default store;
