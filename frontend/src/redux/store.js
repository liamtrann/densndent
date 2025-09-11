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
import favorites from "./slices/favoritesSlice";
import subscriptions from "./slices/subscriptionsSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    subscriptions, // mounted at state.subscriptions
    favorites, // mounted at state.favorites
    bestSellers,
    classification,
    products,
    user,
    itemPriceAfterDiscount,
    recentViews,
  },
});

export default store;
