import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { STATUS } from '../status';

export const fetchBestSellers = createAsyncThunk(
    'bestSellers/fetchBestSellers',
    async (_, { rejectWithValue }) => {
        try {
            const baseUrl = process.env.REACT_APP_API_BASE_URL;
            const url = `${baseUrl}/suiteql/saleInvoiced/top-sale-details?limit=8&fromDate=2025-01-01`;
            const response = await axios.get(url);
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
