import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import endpoint from 'api/endpoints';

import { STATUS } from '../status';

import { api } from '@/api';

export const fetchBestSellers = createAsyncThunk(
    'bestSellers/fetchBestSellers',
    async (params, { rejectWithValue }) => {
        const { limit = 20, fromDate = '2025-01-01' } = params || {};
        try {
            const response = await api(endpoint.GET_TOP_SALE({ limit, fromDate }));
            return response.data.items || response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.error || 'Failed to load best sellers.');
        }
    }
);

const bestSellersSlice = createSlice({
    name: 'bestSellers',
    initialState: {
        items: [],
        status: STATUS.IDLE,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBestSellers.pending, (state) => {
                state.status = STATUS.LOADING;
                state.error = null;
            })
            .addCase(fetchBestSellers.fulfilled, (state, action) => {
                state.status = STATUS.SUCCEEDED;
                state.items = action.payload;
            })
            .addCase(fetchBestSellers.rejected, (state, action) => {
                state.status = STATUS.FAILED;
                state.error = action.payload;
            });
    },
});

export default bestSellersSlice.reducer;
