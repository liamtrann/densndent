import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "api/api";
import endpoint from "api/endpoints";

// Load favorites from user data
export const loadFavorites = createAsyncThunk(
  "favorites/load",
  async ({ userId, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      const token = await getAccessTokenSilently();
      const url = endpoint.GET_CUSTOMER(userId);
      const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const favoriteString = response.data.custentity_favourite_item || "";
      if (!favoriteString) return [];

      return favoriteString
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id !== "")
        .map((id) => Number(id))
        .filter((id) => !isNaN(id));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

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
          custentity_favourite_item: favoriteString,
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
          custentity_favourite_item: favoriteString,
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
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addFavoriteOptimistic,
  removeFavoriteOptimistic,
  syncFavoriteSuccess,
  syncFavoriteFailure,
  clearFavoritesError,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
