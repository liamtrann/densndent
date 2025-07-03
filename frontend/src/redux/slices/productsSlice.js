import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import endpoint from '../../api/endpoints';

// Async thunk to fetch a page of products by class
export const fetchProducts = createAsyncThunk(
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

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        productsByPage: {}, // key: `${classId}_${page}` => products[]
        total: 0,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                const { classId, page, products, total } = action.payload;
                const key = `${classId}_${page}`;
                state.productsByPage[key] = products;
                state.total = total;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default productsSlice.reducer;
