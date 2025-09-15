import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "api/api";
import endpoint from "api/endpoints";

// Helper to build URL and select method
const buildProductUrl = ({
  type,
  id,
  limit,
  offset = 0,
  sort,
  minPrice,
  maxPrice,
}) => {
  switch (type) {
    case "classification":
      return {
        url: endpoint.GET_ITEMS_BY_CLASS({
          classId: id,
          limit,
          offset,
          sort,
          minPrice,
          maxPrice,
        }),
        method: "get",
      };
    case "brand":
      return {
        url: endpoint.GET_ITEMS_BY_BRAND({
          brand: id,
          limit,
          offset,
          sort,
          minPrice,
          maxPrice,
        }),
        method: "get",
      };
    case "name":
      return {
        url: endpoint.POST_GET_ITEMS_BY_NAME({
          limit,
          offset,
          sort,
          minPrice,
          maxPrice,
        }),
        method: "post",
      };
    case "category":
      return {
        url: endpoint.GET_ITEMS_BY_CATEGORY({
          category: id,
          limit,
          offset,
          sort,
          minPrice,
          maxPrice,
        }),
        method: "get",
      };
    case "all":
      return {
        url: endpoint.GET_ALL_PRODUCTS({ limit, offset, sort }),
        method: "get",
      };
    case "orderHistory":
      return {
        url: endpoint.GET_ITEMS_ORDER_HISTORY_BY_USER({
          userId: id,
        }),
        method: "get",
        requiresAuth: true,
      };
    case "favoriteItems":
      return {
        url: endpoint.POST_GET_ITEM_BY_IDS(),
        method: "post",
        requiresAuth: true,
      };
    case "promotion":
      return {
        url: endpoint.GET_PRODUCTS_WITH_ACTIVE_PROMOTIONS({
          limit,
          offset,
        }),
        method: "get",
      };
    default:
      throw new Error("Unknown product type");
  }
};

const buildCountUrl = ({ type, id, minPrice, maxPrice }) => {
  switch (type) {
    case "classification":
      return {
        url: endpoint.GET_COUNT_BY_CLASS({ classId: id, minPrice, maxPrice }),
        method: "get",
      };
    case "brand":
      return {
        url: endpoint.GET_COUNT_BY_BRAND({ brand: id, minPrice, maxPrice }),
        method: "get",
      };
    case "name":
      return {
        url: endpoint.POST_GET_COUNT_BY_NAME({ minPrice, maxPrice }),
        method: "post",
      };
    case "category":
      return {
        url: endpoint.GET_COUNT_BY_CATEGORY({
          category: id,
          minPrice,
          maxPrice,
        }),
        method: "get",
      };
    case "all":
      return {
        url: endpoint.GET_COUNT_ALL_PRODUCTS({ minPrice, maxPrice }),
        method: "get",
      };
    case "promotion":
      return {
        url: endpoint.GET_COUNT_PRODUCTS_WITH_ACTIVE_PROMOTIONS(),
        method: "get",
      };
    default:
      throw new Error("Unknown type");
  }
};

// Async thunk to fetch a page of products
export const fetchProductsBy = createAsyncThunk(
  "products/fetchPage",
  async (
    {
      type,
      id,
      page = 1,
      limit = 12,
      sort,
      minPrice,
      maxPrice,
      getAccessTokenSilently,
    },
    { rejectWithValue }
  ) => {
    try {
      // For non-paginated requests, don't calculate offset or pass limit/offset to API
      const isNonPaginated =
        type === "favoriteItems" || type === "orderHistory";
      const offset = isNonPaginated ? undefined : (page - 1) * limit;

      const { url, method, requiresAuth } = buildProductUrl({
        type,
        id,
        limit: isNonPaginated ? undefined : limit,
        offset: isNonPaginated ? undefined : offset,
        sort,
        minPrice,
        maxPrice,
      });
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

      switch (method) {
        case "post":
          switch (type) {
            case "favoriteItems":
              res = await api.post(url, { ids: id }, { headers });
              break;
            case "name":
              res = await api.post(url, { name: id }, { headers });
              break;
            default:
              res = await api.post(url, { name: id }, { headers });
              break;
          }
          break;
        case "get":
        default:
          res = await api.get(url, { headers });
          break;
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
        type, // Add type to payload for key generation
      };
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);

// Async thunk to fetch count of products
export const fetchCountBy = createAsyncThunk(
  "products/fetchCountBy",
  async ({ type, id, minPrice, maxPrice }, { rejectWithValue }) => {
    try {
      const { url, method } = buildCountUrl({ type, id, minPrice, maxPrice });

      let res;
      if (method === "post") {
        res = await api.post(url, { name: id });
      } else {
        res = await api.get(url);
      }
      return { id: id || "all", count: res.data.count, minPrice, maxPrice };
    } catch (err) {
      return rejectWithValue(err?.response?.data || err.message);
    }
  }
);
const productsSlice = createSlice({
  name: "products",
  initialState: {
    productsByPage: {}, // key: `${id}_${limit}_${sort}_${priceKey}_${page}` => products[]
    totalCounts: {}, // key: `${id}_${priceKey}` => total count (where id can be classId, brandId, "all", etc.)
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
        const {
          id,
          page,
          products,
          total,
          limit,
          sort,
          minPrice,
          maxPrice,
          type,
        } = action.payload;
        const priceKey = `${minPrice || ""}_${maxPrice || ""}`;
        const effectiveId = id || "all";

        // For non-paginated requests (favoriteItems, orderHistory), use simpler key
        const isNonPaginated =
          type === "favoriteItems" || type === "orderHistory";
        const key = isNonPaginated
          ? `${effectiveId}_${sort}_${priceKey}`
          : `${effectiveId}_${limit || 12}_${sort}_${priceKey}_${page}`;
        const countKey = `${effectiveId}_${priceKey}`;

        state.productsByPage[key] = products;

        // Store the total count if it's provided in the response
        if (total && total > 0) {
          state.totalCounts[countKey] = total;
        }
      })
      .addCase(fetchProductsBy.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCountBy.fulfilled, (state, action) => {
        const { id, count, minPrice, maxPrice } = action.payload;
        const priceKey = `${minPrice || ""}_${maxPrice || ""}`;
        const countKey = `${id}_${priceKey}`;
        state.totalCounts[countKey] = count;
      });
  },
});

export default productsSlice.reducer;
