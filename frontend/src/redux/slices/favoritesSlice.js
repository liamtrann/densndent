import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "api/api";
import endpoint from "api/endpoints";

/**
 * Initialize favorites from whatever the backend gives us.
 * Supports:
 *  - "1,2,3" (CSV string)
 *  - { items: [{id:1}, {id:2}] } (object)
 *  - [1,2,3] (array)
 */
export const initializeFavorites = (raw) => {
  if (!raw) return [];

  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((x) => Number(String(x).trim()))
      .filter((n) => !isNaN(n));
  }

  if (Array.isArray(raw)) {
    return raw.map((x) => Number(x)).filter((n) => !isNaN(n));
  }

  if (typeof raw === "object" && Array.isArray(raw.items)) {
    return raw.items
      .map((x) => Number(x?.id ?? x))
      .filter((n) => !isNaN(n));
  }

  return [];
};

/**
 * Add favorite (optimistic). We try to PATCH using the newer object shape.
 * If that fails (e.g. server still expects CSV), we automatically retry with CSV.
 */
export const addToFavorites = createAsyncThunk(
  "favorites/add",
  async (
    { itemId, userId, getAccessTokenSilently },
    { dispatch, getState, rejectWithValue }
  ) => {
    // optimistic UI
    dispatch(addFavoriteOptimistic(itemId));

    const stateAfter = getState().favorites.items;
    const asObject = { items: stateAfter.map((id) => ({ id })) };
    const asCsv = stateAfter.join(",");

    try {
      const token = await getAccessTokenSilently();
      const url = endpoint.PATCH_UPDATE_CUSTOMER(userId);

      // 1) try object shape
      try {
        await api.patch(
          url,
          { custentity_favorite_item: asObject },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch {
        // 2) fallback to CSV
        await api.patch(
          url,
          { custentity_favorite_item: asCsv },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      dispatch(syncFavoriteSuccess(itemId));
      return itemId;
    } catch (error) {
      // rollback
      dispatch(syncFavoriteFailure({ itemId, wasAdding: true }));
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

/**
 * Remove favorite (optimistic) with the same dual-format PATCH strategy.
 */
export const removeFromFavorites = createAsyncThunk(
  "favorites/remove",
  async (
    { itemId, userId, getAccessTokenSilently },
    { dispatch, getState, rejectWithValue }
  ) => {
    // optimistic UI
    dispatch(removeFavoriteOptimistic(itemId));

    const stateAfter = getState().favorites.items;
    const asObject = { items: stateAfter.map((id) => ({ id })) };
    const asCsv = stateAfter.join(",");

    try {
      const token = await getAccessTokenSilently();
      const url = endpoint.PATCH_UPDATE_CUSTOMER(userId);

      // 1) try object shape
      try {
        await api.patch(
          url,
          { custentity_favorite_item: asObject },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch {
        // 2) fallback to CSV
        await api.patch(
          url,
          { custentity_favorite_item: asCsv },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      dispatch(syncFavoriteSuccess(itemId));
      return itemId;
    } catch (error) {
      // rollback
      dispatch(syncFavoriteFailure({ itemId, wasAdding: false }));
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],            // number[]
    pendingUpdates: [],   // number[] (ids being synced)
    isLoading: false,
    error: null,
  },
  reducers: {
    setFavorites: (state, action) => {
      state.items = action.payload || [];
      state.isLoading = false;
      state.error = null;
    },
    addFavoriteOptimistic: (state, action) => {
      const id = Number(action.payload);
      if (!state.items.includes(id)) state.items.push(id);
      if (!state.pendingUpdates.includes(id)) state.pendingUpdates.push(id);
    },
    removeFavoriteOptimistic: (state, action) => {
      const id = Number(action.payload);
      state.items = state.items.filter((x) => x !== id);
      if (!state.pendingUpdates.includes(id)) state.pendingUpdates.push(id);
    },
    syncFavoriteSuccess: (state, action) => {
      const id = Number(action.payload);
      state.pendingUpdates = state.pendingUpdates.filter((x) => x !== id);
    },
    syncFavoriteFailure: (state, action) => {
      const { itemId, wasAdding } = action.payload || {};
      const id = Number(itemId);

      // rollback
      if (wasAdding) {
        // undo add
        state.items = state.items.filter((x) => x !== id);
      } else {
        // undo remove
        if (!state.items.includes(id)) state.items.push(id);
      }
      state.pendingUpdates = state.pendingUpdates.filter((x) => x !== id);
      state.error = "Failed to sync favorites.";
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
