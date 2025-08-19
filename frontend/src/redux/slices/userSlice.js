import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "api/api";
import endpoint from "api/endpoints";

// Async thunk to fetch user info from backend
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async ({ user, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      const token = await getAccessTokenSilently();
      const res = await api.get(endpoint.GET_CUSTOMER_BY_EMAIL(user.email), {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assume response is an array, take the first item
      return res.data[0] || null;
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);

const initialState = {
  info: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserInfo(state) {
      state.info = null;
      state.error = null;
      state.loading = false;
    },
    clearUser(state) {
      state.info = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.info = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user info";
      });
  },
});

export const { clearUserInfo, clearUser } = userSlice.actions;
export default userSlice.reducer;
