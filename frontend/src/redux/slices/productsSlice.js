import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import api from 'api/api';
import endpoint from 'api/endpoints';

// Helper to build URL and select method
const buildProductUrl = ({ type, id, limit, offset = 0, sort, minPrice, maxPrice }) => {
  switch (type) {
    case "classification":
      return { url: endpoint.GET_ITEMS_BY_CLASS({ classId: id, limit, offset, sort, minPrice, maxPrice }), method: "get" };
    case "brand":
      return { url: endpoint.GET_ITEMS_BY_BRAND({ brand: id, limit, offset, sort, minPrice, maxPrice }), method: "get" };
    case "name":
      return { url: endpoint.POST_GET_ITEMS_BY_NAME({ limit, offset, sort, minPrice, maxPrice }), method: "post" };
    case "orderHistory":
      return {
        url: endpoint.GET_ITEMS_ORDER_HISTORY_BY_USER({ userId: id, limit, offset }),
        method: "get",
        requiresAuth: true
      };
    default:
      throw new Error("Unknown product type");
  }
};

const buildCountUrl = ({ type, id, minPrice, maxPrice }) => {
  switch (type) {
    case "classification":
      return { url: endpoint.GET_COUNT_BY_CLASS({ classId: id, minPrice, maxPrice }), method: "get" };
    case "brand":
      return { url: endpoint.GET_COUNT_BY_BRAND({ brand: id, minPrice, maxPrice }), method: "get" };
    case "name":
      return { url: endpoint.POST_GET_COUNT_BY_NAME({ minPrice, maxPrice }), method: "post" };
    case "category":
      return { url: endpoint.GET_COUNT_BY_CATEGORY({ category: id, minPrice, maxPrice }), method: "get" };
    default:
      throw new Error("Unknown type");
  }
};

// Async thunk to fetch a page of products
export const fetchProductsBy = createAsyncThunk(
  'products/fetchPage',
  async ({ type, id, page, limit, sort, minPrice, maxPrice, getAccessTokenSilently }, { rejectWithValue }) => {

    try {
      const offset = (page - 1) * limit;
      const { url, method, requiresAuth } = buildProductUrl({ type, id, limit, offset, sort, minPrice, maxPrice });
      let res;

      // Set up headers for authenticated requests
      const headers = {};
      if (requiresAuth && getAccessTokenSilently) {
        try {
          const token = await getAccessTokenSilently();
          headers.Authorization = `Bearer ${token}`;
        } catch (tokenError) {
          return rejectWithValue("Failed to get authentication token");
        }
      }

      if (method === "post") {
        res = await api.post(url, { name: id }, { headers });
      } else {
        res = await api.get(url, { headers });
      }
      return {
        id,
        page,
        products: res.data.items || res.data,
        total: res.data.total || 0,
        limit,
        sort,
        minPrice,
        maxPrice,
      };
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);

// Async thunk to fetch count of products
export const fetchCountBy = createAsyncThunk(
  'products/fetchCountBy',
  async ({ type, id, minPrice, maxPrice }, { rejectWithValue }) => {
    try {
      const { url, method } = buildCountUrl({ type, id, minPrice, maxPrice });
      let res;
      if (method === "post") {
        res = await api.post(url, { name: id });
      } else {
        res = await api.get(url);
      }
      return { id, count: res.data.count, minPrice, maxPrice };
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
        const { id, page, products, limit, sort, minPrice, maxPrice } = action.payload;
        const priceKey = `${minPrice || ''}_${maxPrice || ''}`;
        const key = `${id}_${limit || 12}_${sort}_${priceKey}_${page}`;
        state.productsByPage[key] = products;
      })
      .addCase(fetchProductsBy.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCountBy.fulfilled, (state, action) => {
        const { id, count, minPrice, maxPrice } = action.payload;
        const priceKey = `${minPrice || ''}_${maxPrice || ''}`;
        const countKey = `${id}_${priceKey}`;
        state.totalByClass[countKey] = count;
        state.total = count;
      });
  },
});

export default productsSlice.reducer;
