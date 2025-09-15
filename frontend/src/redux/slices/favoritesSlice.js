import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "api/api";
import endpoint from "api/endpoints";

/* ---------- helpers: localStorage ---------- */
const LS_KEY = "favorites";

function loadFromLS() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    return Array.isArray(raw) ? raw.map(Number).filter((n) => !isNaN(n)) : [];
  } catch {
    return [];
  }
}
function saveToLS(ids) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(ids || []));
  } catch {}
}

/* ---------- parse whatever backend returns ---------- */
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

/* ---------- build server PATCH body (try object, then CSV) ---------- */
async function patchFavorites({ ids, userId, getAccessTokenSilently }) {
  const token = await getAccessTokenSilently();
  const url = endpoint.PATCH_UPDATE_CUSTOMER(userId);
  const headers = { Authorization: `Bearer ${token}` };

  // try object first
  try {
    await api.patch(
      url,
      { custentity_favorite_item: { items: ids.map((id) => ({ id })) } },
      { headers }
    );
    return;
  } catch {
    // fallback to CSV
    await api.patch(
      url,
      { custentity_favorite_item: ids.join(",") },
      { headers }
    );
    return;
  }
}

/* ---------- thunks ---------- */
export const addToFavorites = createAsyncThunk(
  "favorites/add",
  async ({ itemId, userId, getAccessTokenSilently }, { dispatch, getState, rejectWithValue }) => {
    dispatch(addFavoriteOptimistic(itemId));
    try {
      const ids = getState().favorites.items;
      await patchFavorites({ ids, userId, getAccessTokenSilently });
      dispatch(syncFavoriteSuccess(itemId));
      return itemId;
    } catch (err) {
      dispatch(syncFavoriteFailure({ itemId, wasAdding: true }));
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  "favorites/remove",
  async ({ itemId, userId, getAccessTokenSilently }, { dispatch, getState, rejectWithValue }) => {
    dispatch(removeFavoriteOptimistic(itemId));
    try {
      const ids = getState().favorites.items;
      await patchFavorites({ ids, userId, getAccessTokenSilently });
      dispatch(syncFavoriteSuccess(itemId));
      return itemId;
    } catch (err) {
      dispatch(syncFavoriteFailure({ itemId, wasAdding: false }));
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);

/* ---------- slice ---------- */
const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    // hydrate from localStorage so refresh shows items immediately
    items: loadFromLS(),        // number[]
    pendingUpdates: [],         // number[]
    isLoading: false,
    error: null,
  },
  reducers: {
    // Initialize/replace from app boot (we'll merge in App.js)
    setFavorites: (state, action) => {
      state.items = (action.payload || []).map(Number).filter((n) => !isNaN(n));
      saveToLS(state.items);
      state.error = null;
    },

    addFavoriteOptimistic: (state, action) => {
      const id = Number(action.payload);
      if (!state.items.includes(id)) state.items.push(id);
      if (!state.pendingUpdates.includes(id)) state.pendingUpdates.push(id);
      saveToLS(state.items);
    },

    removeFavoriteOptimistic: (state, action) => {
      const id = Number(action.payload);
      state.items = state.items.filter((x) => x !== id);
      if (!state.pendingUpdates.includes(id)) state.pendingUpdates.push(id);
      saveToLS(state.items);
    },

    syncFavoriteSuccess: (state, action) => {
      const id = Number(action.payload);
      state.pendingUpdates = state.pendingUpdates.filter((x) => x !== id);
      saveToLS(state.items);
    },

    syncFavoriteFailure: (state, action) => {
      const { itemId, wasAdding } = action.payload || {};
      const id = Number(itemId);
      if (wasAdding) {
        // rollback add
        state.items = state.items.filter((x) => x !== id);
      } else {
        // rollback remove
        if (!state.items.includes(id)) state.items.push(id);
      }
      state.pendingUpdates = state.pendingUpdates.filter((x) => x !== id);
      saveToLS(state.items);
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
