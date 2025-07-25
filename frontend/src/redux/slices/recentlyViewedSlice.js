// src/store/slices/recentlyViewedSlice.js
import { createSlice } from "@reduxjs/toolkit";

const MAX_RECENTLY_VIEWED = 10;

const recentlyViewedSlice = createSlice({
  name: "recentlyViewed",
  initialState: {
    items: [],
  },
  reducers: {
    addRecentlyViewed: (state, action) => {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingIndex !== -1) {
        state.items.splice(existingIndex, 1);
      }

      state.items.unshift(action.payload);

      if (state.items.length > MAX_RECENTLY_VIEWED) {
        state.items.pop();
      }
    },
  },
});

export const { addRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;
