import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import endpoint from '../../api/endpoints';

// Async thunk to fetch all classifications
export const fetchClassifications = createAsyncThunk(
    'classification/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(endpoint.GET_ALL_CLASSIFICATIONS);
            // Clean data: remove 'links' field from each item
            const clean = (arr) => arr.map(item => {
                const { links, ...rest } = item;
                return rest;
            });
            // If res.data.items exists, clean that, else clean res.data
            if (Array.isArray(res.data.items)) {
                return { ...res.data, items: clean(res.data.items) };
            } else if (Array.isArray(res.data)) {
                return clean(res.data);
            } else {
                return res.data;
            }
        } catch (err) {
            return rejectWithValue(err?.response?.data || err.message);
        }
    }
);

// Helper to nest children under their parent (one level only)
function nestClassifications(flatList) {
    // Parent items: no parent field
    const parents = flatList.filter(item => !item.parent);
    // For each parent, find its children
    return parents.map(parent => ({
        ...parent,
        child: flatList
            .filter(item => item.parent === parent.id)
            .map(child => ({ ...child }))
    }));
}

const classificationSlice = createSlice({
    name: 'classification',
    initialState: {
        classes: [], // Array of { id, name, parent, subsidiary, child }
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClassifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClassifications.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = nestClassifications(action.payload.items || []);
            })
            .addCase(fetchClassifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default classificationSlice.reducer;
