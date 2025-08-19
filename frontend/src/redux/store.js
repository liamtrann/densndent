import { configureStore } from "@reduxjs/toolkit";

import {
  cartReducer,
  bestSellers,
  classification,
  products,
  user,
  itemPriceAfterDiscount,
  recentViews,
} from "./slices";

// ✅ Direct import (bypass barrel) so we don't depend on it exporting this
import subscriptions from "./slices/subscriptionsSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    subscriptions, // mounted at state.subscriptions
    bestSellers,
    classification,
    products,
    user,
    itemPriceAfterDiscount,
    recentViews,
  },
});

export default store;
