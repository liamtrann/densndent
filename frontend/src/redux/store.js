import { configureStore } from '@reduxjs/toolkit';

import { cartReducer, bestSellers, classification, products, user, itemPriceAfterDiscount, recentViews } from './slices';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        bestSellers,
        classification,
        products,
        user,
        itemPriceAfterDiscount,
        recentViews,
    },
});

export default store;
