import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "api/api";
import endpoint from "api/endpoints";

// Initialize favorites from user data (no API call needed)
export const initializeFavorites = (favoriteString) => {
  if (!favoriteString) return [];

  return favoriteString
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id !== "")
    .map((id) => Number(id))
    .filter((id) => !isNaN(id));
};

// Add favorite with optimistic update
export const addToFavorites = createAsyncThunk(
  "favorites/add",
  async (
    { itemId, userId, getAccessTokenSilently },
    { dispatch, getState, rejectWithValue }
  ) => {
    // Optimistic update first
    dispatch(addFavoriteOptimistic(itemId));

    try {
      // Get current favorites and add new one
      const currentFavorites = getState().favorites.items;
      const favoriteString = currentFavorites.join(",");

      const token = await getAccessTokenSilently();
      const url = endpoint.PATCH_UPDATE_CUSTOMER(userId);

      await api.patch(
        url,
        {
          custentity_favorite_item: favoriteString,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(syncFavoriteSuccess(itemId));
      return itemId;
    } catch (error) {
      dispatch(syncFavoriteFailure({ itemId, wasAdding: true }));
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Remove favorite with optimistic update
export const removeFromFavorites = createAsyncThunk(
  "favorites/remove",
  async (
    { itemId, userId, getAccessTokenSilently },
    { dispatch, getState, rejectWithValue }
  ) => {
    // Optimistic update first
    dispatch(removeFavoriteOptimistic(itemId));

    try {
      // Get current favorites and remove the item
      const currentFavorites = getState().favorites.items;
      const favoriteString = currentFavorites.join(",");

      const token = await getAccessTokenSilently();
      const url = endpoint.PATCH_UPDATE_CUSTOMER(userId);

      await api.patch(
        url,
        {
          custentity_favorite_item: favoriteString,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(syncFavoriteSuccess(itemId));
      return itemId;
    } catch (error) {
      dispatch(syncFavoriteFailure({ itemId, wasAdding: false }));
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [], // Array of favorite item IDs
    pendingUpdates: [], // Track items being synced
    isLoading: false,
    error: null,
  },
  reducers: {
    // Initialize favorites from user data
    setFavorites: (state, action) => {
      state.items = action.payload || [];
      state.isLoading = false;
      state.error = null;
    },

    // Optimistic updates (immediate UI changes)
    addFavoriteOptimistic: (state, action) => {
      const itemId = action.payload;
      if (!state.items.includes(itemId)) {
        state.items.push(itemId);
      }
      if (!state.pendingUpdates.includes(itemId)) {
        state.pendingUpdates.push(itemId);
      }
    },

    removeFavoriteOptimistic: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((id) => id !== itemId);
      if (!state.pendingUpdates.includes(itemId)) {
        state.pendingUpdates.push(itemId);
      }
    },

    // Sync completion
    syncFavoriteSuccess: (state, action) => {
      const itemId = action.payload;
      state.pendingUpdates = state.pendingUpdates.filter((id) => id !== itemId);
    },

    // Rollback on failure
    syncFavoriteFailure: (state, action) => {
      const { itemId, wasAdding } = action.payload;

      if (wasAdding) {
        // Rollback add - remove from favorites
        state.items = state.items.filter((id) => id !== itemId);
      } else {
        // Rollback remove - add back to favorites
        if (!state.items.includes(itemId)) {
          state.items.push(itemId);
        }
      }

      state.pendingUpdates = state.pendingUpdates.filter((id) => id !== itemId);
      state.error = `Failed to ${wasAdding ? "add" : "remove"} favorite`;
    },

    clearFavoritesError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setFavorites,
  addFavoriteOptimistic,
  removeFavoriteOptimistic,
  syncFavoriteSuccess,
  syncFavoriteFailure,
  clearFavoritesError,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
