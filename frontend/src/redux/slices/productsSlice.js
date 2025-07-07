import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import endpoint from '../../api/endpoints';

// Async thunk to fetch a page of products by class
export const fetchProductsBy = createAsyncThunk(
    'products/fetchPage',
    async ({ type, id, page, limit, sort }, { rejectWithValue }) => {
        try {
            let url;
            const offset = (page - 1) * limit;
            if (type === "classification") {
                url = endpoint.GET_ITEMS_BY_CLASS({ classId: id, limit, offset, sort });
            } else if (type === "brand") {
                url = endpoint.GET_ITEMS_BY_BRAND({ brand: id, limit, offset, sort });
            } else {
                throw new Error("Unknown product type");
            }
            console.log(url)
            const res = await api.get(url);
            // Assume API returns { items: [...], total: N }
            return {
                id,
                page,
                products: res.data.items || res.data,
                total: res.data.total || 0,
                limit,
                sort,
            };
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

// Async thunk to fetch count of products by class
export const fetchCountBy = createAsyncThunk(
    'products/fetchCountBy',
    async ({ type, id }, { rejectWithValue }) => {
        try {
            let url;
            if (type === "classification") {
                url = endpoint.GET_COUNT_BY_CLASS(id);
            } else if (type === "brand") {
                url = endpoint.GET_COUNT_BY_BRAND(id);
            } else {
                throw new Error("Unknown type");
            }
            const res = await api.get(url);
            return { id, count: res.data.count };
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
            .addCase(fetchProductsBy.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProductsBy.fulfilled, (state, action) => {
                state.isLoading = false;
                const { id, page, products, limit, sort } = action.payload;
                // Use a key that includes perPage (limit) and sort
                const key = `${id}_${limit || 12}_${sort}_${page}`;
                state.productsByPage[key] = products;
                // Optionally update total for this page, but prefer count from fetchCountByClass
            })
            .addCase(fetchProductsBy.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchCountBy.fulfilled, (state, action) => {
                const { id, count } = action.payload;
                state.totalByClass[id] = count;
                state.total = count;
            });
    },
});

export default productsSlice.reducer;
