import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';
import endpoint from '../../api/endpoints';
import { STATUS } from '../status';

// Async thunk to calculate price after discount
export const calculatePriceAfterDiscount = createAsyncThunk(
    'itemPriceAfterDiscount/calculatePriceAfterDiscount',
    async ({ productId, unitPrice, quantity }, { rejectWithValue }) => {
        try {
            // Fetch promotions for the product
            const promotionUrl = endpoint.GET_PROMOTIONS_BY_PRODUCT({
                productId
            });

            const response = await api.get(promotionUrl);
            const promotions = response.data;

            if (!promotions || promotions.length === 0) {
                return {
                    productId,
                    unitPrice,
                    quantity,
                    originalPrice: Number(unitPrice) * Number(quantity),
                    discountedPrice: Number(unitPrice) * Number(quantity),
                    discount: 0,
                    promotionApplied: null
                };
            }

            const originalTotal = Number(unitPrice) * Number(quantity);
            let bestDiscount = 0;
            let bestPromotion = null;

            // Check each promotion to find the best discount
            for (const promotion of promotions) {
                const { fixedprice, itemquantifier } = promotion;

                // Skip if promotion doesn't have required fields
                if (!fixedprice || !itemquantifier) continue;

                // Check if quantity meets the minimum requirement
                if (Number(quantity) >= Number(itemquantifier)) {
                    // Calculate discounted price: fixedprice * quantity
                    const discountedTotal = Number(fixedprice) * Number(quantity);
                    const discount = originalTotal - discountedTotal;

                    // Keep track of best discount
                    if (discount > bestDiscount) {
                        bestDiscount = discount;
                        bestPromotion = promotion;
                    }
                }
            }

            return {
                productId,
                unitPrice,
                quantity,
                originalPrice: originalTotal,
                discountedPrice: originalTotal - bestDiscount,
                discount: bestDiscount,
                promotionApplied: bestPromotion
            };
        } catch (error) {
            console.error('Error calculating discount:', error);
            // Return original price if error occurs
            const originalTotal = Number(unitPrice) * Number(quantity);
            return rejectWithValue({
                productId,
                unitPrice,
                quantity,
                originalPrice: originalTotal,
                discountedPrice: originalTotal,
                discount: 0,
                promotionApplied: null,
                error: error.message
            });
        }
    }
);

const itemPriceAfterDiscountSlice = createSlice({
    name: 'itemPriceAfterDiscount',
    initialState: {
        // Store price data by productId
        priceData: {},
        status: STATUS.IDLE,
        error: null,
    },
    reducers: {
        // Clear price data for a specific product
        clearProductPriceData: (state, action) => {
            const { productId } = action.payload;
            delete state.priceData[productId];
        },
        // Clear all price data
        clearAllPriceData: (state) => {
            state.priceData = {};
            state.status = STATUS.IDLE;
            state.error = null;
        },
        // Update price data directly (for manual updates)
        updatePriceData: (state, action) => {
            const { productId, priceInfo } = action.payload;
            state.priceData[productId] = priceInfo;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(calculatePriceAfterDiscount.pending, (state) => {
                state.status = STATUS.LOADING;
                state.error = null;
            })
            .addCase(calculatePriceAfterDiscount.fulfilled, (state, action) => {
                state.status = STATUS.SUCCEEDED;
                const { productId, unitPrice, quantity, originalPrice, discountedPrice, discount, promotionApplied } = action.payload;

                // Create a unique key for the product with its price and quantity
                const priceKey = `${productId}-${unitPrice}-${quantity}`;

                state.priceData[priceKey] = {
                    productId,
                    unitPrice,
                    quantity,
                    originalPrice,
                    discountedPrice,
                    discount,
                    promotionApplied,
                    calculatedAt: new Date().toISOString(),
                };
            })
            .addCase(calculatePriceAfterDiscount.rejected, (state, action) => {
                state.status = STATUS.FAILED;
                state.error = action.payload;
            });
    },
});

export const {
    clearProductPriceData,
    clearAllPriceData,
    updatePriceData,
} = itemPriceAfterDiscountSlice.actions;

export default itemPriceAfterDiscountSlice.reducer;

// Selectors
export const selectPriceDataByKey = (state, productId, unitPrice, quantity) => {
    const priceKey = `${productId}-${unitPrice}-${quantity}`;
    return state.itemPriceAfterDiscount.priceData[priceKey];
};

export const selectAllPriceData = (state) => state.itemPriceAfterDiscount.priceData;

export const selectPriceStatus = (state) => state.itemPriceAfterDiscount.status;

export const selectPriceError = (state) => state.itemPriceAfterDiscount.error;

export const selectHasDiscount = (state, productId, unitPrice, quantity) => {
    const priceData = selectPriceDataByKey(state, productId, unitPrice, quantity);
    return priceData && priceData.discount > 0;
};

export const selectDiscountAmount = (state, productId, unitPrice, quantity) => {
    const priceData = selectPriceDataByKey(state, productId, unitPrice, quantity);
    return priceData ? priceData.discount : 0;
};

export const selectFinalPrice = (state, productId, unitPrice, quantity) => {
    const priceData = selectPriceDataByKey(state, productId, unitPrice, quantity);
    return priceData ? priceData.discountedPrice : (unitPrice * quantity);
};
