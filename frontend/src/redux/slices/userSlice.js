import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "api/api";
import endpoint from "api/endpoints";

// Async thunk to fetch user info from backend
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async ({ user, getAccessTokenSilently }, { rejectWithValue }) => {
    try {
      const token = await getAccessTokenSilently();

      // Fetch user info
      const userRes = await api.get(
        endpoint.GET_CUSTOMER_BY_EMAIL(user.email),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userInfo = userRes.data[0] || null;

      // Fetch Stripe customer info and add it to userInfo
      let stripeCustomerId = null;
      try {
        const stripeRes = await api.get(
          endpoint.GET_STRIPE_CUSTOMER_BY_EMAIL(user.email),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        stripeCustomerId = stripeRes.data.customer.id;
      } catch (stripeError) {
        // Don't fail the whole request if Stripe customer fetch fails
        // stripeCustomerId will remain null
      }

      // Add stripeCustomerId to userInfo object
      const updatedUserInfo = userInfo
        ? {
            ...userInfo,
            stripeCustomerId,
          }
        : null;

      return {
        userInfo: updatedUserInfo,
      };
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
    updateStripeCustomerId(state, action) {
      if (state.info) {
        state.info.stripeCustomerId = action.payload;
      }
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
        state.info = action.payload.userInfo;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user info";
      });
  },
});

export const { clearUserInfo, clearUser, updateStripeCustomerId } =
  userSlice.actions;
export default userSlice.reducer;
