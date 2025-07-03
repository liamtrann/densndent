import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import endpoint from '../../api/endpoints';

// Async thunk to fetch a page of products by class
export const fetchProductsPage = createAsyncThunk(
    'products/fetchPage',
    async ({ classId, page, limit }, { rejectWithValue }) => {
        try {
            const offset = (page - 1) * limit;
            const url = endpoint.GET_ITEMS_BY_CLASS({ classId, limit, offset });
            const res = await api.get(url);
            // Assume API returns { items: [...], total: N }
            return {
                page,
                products: res.data.items || res.data,
                total: res.data.total || 0,
                classId,
                limit,
                offset
            };
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        productsByPage: {},
        total: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsPage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductsPage.fulfilled, (state, action) => {
                state.loading = false;
                const { page, products, total, classId, limit, offset } = action.payload;
                const key = `${classId}_${page}_${limit}`;
                state.productsByPage[key] = { products, classId, page, limit, offset };
                state.total = total;
            })
            .addCase(fetchProductsPage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productsSlice.reducer;
