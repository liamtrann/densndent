import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addToRecentViews, fetchRecentProducts } from '../redux/slices/recentViewsSlice';

export const useRecentViews = () => {
    const dispatch = useDispatch();
    const { viewedProductIds, recentProducts, loading, error } = useSelector(
        (state) => state.recentViews
    );

    const addProductToRecentViews = useCallback((productId) => {
        // Add to recent views - the slice will handle updating the IDs array
        dispatch(addToRecentViews(productId));
    }, [dispatch]);

    const refreshRecentProducts = useCallback(() => {
        if (viewedProductIds.length > 0) {
            dispatch(fetchRecentProducts(viewedProductIds));
        }
    }, [dispatch, viewedProductIds]);

    return {
        viewedProductIds,
        recentProducts,
        loading,
        error,
        addProductToRecentViews,
        refreshRecentProducts,
    };
};
