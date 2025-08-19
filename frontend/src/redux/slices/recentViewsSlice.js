import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../api/api";
import endpoint from "../../api/endpoints";

// 💾 LocalStorage helper functions for persistent recent views
const loadRecentViewsFromStorage = () => {
  try {
    const data = localStorage.getItem("recentViews");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveRecentViewsToStorage = (viewedProductIds) => {
  try {
    localStorage.setItem("recentViews", JSON.stringify(viewedProductIds));
  } catch {}
};

// Async thunk for adding a product to recent views and fetching products
export const addToRecentViews = createAsyncThunk(
  "recentViews/addToRecentViews",
  async (productId, { getState, dispatch }) => {
    // Get current state
    const currentState = getState().recentViews.viewedProductIds;

    // Calculate new IDs array
    const newIds = [
      productId,
      ...currentState.filter((id) => id !== productId),
    ].slice(0, 10);

    // Fetch products for the new IDs
    if (newIds.length > 0) {
      dispatch(fetchRecentProducts(newIds));
    }

    return { productId, newIds };
  }
);

// Async thunk for fetching recent products by IDs
export const fetchRecentProducts = createAsyncThunk(
  "recentViews/fetchRecentProducts",
  async (productIds, { rejectWithValue }) => {
    try {
      if (!productIds || productIds.length === 0) {
        return [];
      }

      const response = await api.post(endpoint.POST_GET_ITEM_BY_IDS(), {
        ids: productIds,
      });

      // Maintain the order based on productIds array
      const orderedProducts = productIds
        .map((id) => response.data.find((product) => product.id === id))
        .filter(Boolean); // Remove any undefined items

      return orderedProducts;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.error || "Failed to fetch recent products"
      );
    }
  }
);

const initialState = {
  viewedProductIds: loadRecentViewsFromStorage(),
  recentProducts: [],
  loading: false,
  error: null,
};

const recentViewsSlice = createSlice({
  name: "recentViews",
  initialState,
  reducers: {
    setRecentProducts: (state, action) => {
      state.recentProducts = action.payload;
      state.loading = false;
      state.error = null;
    },
    setRecentViewsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setRecentViewsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearRecentViews: (state) => {
      state.viewedProductIds = [];
      state.recentProducts = [];
      state.error = null;
      saveRecentViewsToStorage(state.viewedProductIds);
    },
    loadRecentViews: (state) => {
      state.viewedProductIds = loadRecentViewsFromStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle addToRecentViews async thunk
      .addCase(addToRecentViews.fulfilled, (state, action) => {
        state.viewedProductIds = action.payload.newIds;
        saveRecentViewsToStorage(state.viewedProductIds);
      })
      // Handle fetchRecentProducts async thunk
      .addCase(fetchRecentProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.recentProducts = action.payload;
        state.error = null;
      })
      .addCase(fetchRecentProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setRecentProducts,
  setRecentViewsLoading,
  setRecentViewsError,
  clearRecentViews,
  loadRecentViews,
} = recentViewsSlice.actions;

export default recentViewsSlice.reducer;
