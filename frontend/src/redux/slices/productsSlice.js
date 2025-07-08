import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import endpoint from '../../api/endpoints';

// Helper to build URL and select method
const buildProductUrl = ({ type, id, limit, offset = 0, sort }) => {
  switch (type) {
    case "classification":
      return { url: endpoint.GET_ITEMS_BY_CLASS({ classId: id, limit, offset, sort }), method: "get" };
    case "brand":
      return { url: endpoint.GET_ITEMS_BY_BRAND({ brand: id, limit, offset, sort }), method: "get" };
    case "name":
      return { url: endpoint.POST_GET_ITEMS_BY_NAME({ limit, offset, sort }), method: "post" };
    default:
      throw new Error("Unknown product type");
  }
};

const buildCountUrl = ({ type, id }) => {
  switch (type) {
    case "classification":
      return { url: endpoint.GET_COUNT_BY_CLASS(id), method: "get" };
    case "brand":
      return { url: endpoint.GET_COUNT_BY_BRAND(id), method: "get" };
    case "name":
      return { url: endpoint.POST_GET_COUNT_BY_NAME(), method: "post" };
    default:
      throw new Error("Unknown type");
  }
};

// Async thunk to fetch a page of products
export const fetchProductsBy = createAsyncThunk(
  'products/fetchPage',
  async ({ type, id, page, limit, sort }, { rejectWithValue }) => {
    try {
      const offset = (page - 1) * limit;
      const { url, method } = buildProductUrl({ type, id, limit, offset, sort });
      let res;
      if (method === "post") {
        res = await api.post(url, { name: id });
      } else {
        res = await api.get(url);
      }
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

// Async thunk to fetch count of products
export const fetchCountBy = createAsyncThunk(
  'products/fetchCountBy',
  async ({ type, id }, { rejectWithValue }) => {
    try {
      const { url, method } = buildCountUrl({ type, id });
      let res;
      if (method === "post") {
        res = await api.post(url, { name: id });
      } else {
        res = await api.get(url);
      }
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
        const key = `${id}_${limit || 12}_${sort}_${page}`;
        state.productsByPage[key] = products;
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
