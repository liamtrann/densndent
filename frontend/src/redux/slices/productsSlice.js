import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import endpoint from '../../api/endpoints';

// Async thunk to fetch a page of products by class
export const fetchProductsByClass = createAsyncThunk(
    'products/fetchPage',
    async ({ classId, page, limit }, { rejectWithValue }) => {
        try {
            const offset = (page - 1) * limit;
            const url = endpoint.GET_ITEMS_BY_CLASS({ classId, limit, offset });
            const res = await api.get(url);
            // Assume API returns { items: [...], total: N }
            return {
                classId,
                page,
                products: res.data.items || res.data,
                total: res.data.total || 0,
            };
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

// Async thunk to fetch count of products by class
export const fetchCountByClass = createAsyncThunk(
    'products/fetchCountByClass',
    async (classId, { rejectWithValue }) => {
        try {
            const url = endpoint.GET_COUNT_BY_CLASS(classId);
            const res = await api.get(url);
            return { classId, count: res.data.count };
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        productsByPage: {}, // key: `${classId}_${page}` => products[]
        totalByClass: {},   // key: classId => total count
        total: 0,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsByClass.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProductsByClass.fulfilled, (state, action) => {
                state.isLoading = false;
                const { classId, page, products, total } = action.payload;
                const key = `${classId}_${page}`;
                state.productsByPage[key] = products;
                // Optionally update total for this page, but prefer count from fetchCountByClass
            })
            .addCase(fetchProductsByClass.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchCountByClass.fulfilled, (state, action) => {
                const { classId, count } = action.payload;
                state.totalByClass[classId] = count;
                state.total = count;
            });
    },
});

export default productsSlice.reducer;
