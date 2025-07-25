// src/components/RecentlyViewedSection.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BestSellerCard, AnimatedCard } from "common";
import BlueBanner from "./BlueBanner";
import { fetchRecentProducts } from "../../redux/slices/recentViewsSlice";

export default function RecentlyViewedSection() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { recentProducts, loading, error, viewedProductIds } = useSelector(
    (state) => state.recentViews
  );

  useEffect(() => {
    if (viewedProductIds.length > 0 && recentProducts.length === 0) {
      dispatch(fetchRecentProducts(viewedProductIds));
    }
  }, [viewedProductIds, recentProducts, dispatch]);

  const handleClick = (item) => {
    navigate(`/product/${item.id}`);
  };

  const hasItems = recentProducts && recentProducts.length > 0;

  // Don't render the section if there are no items and not loading
  if (!hasItems && !loading) {
    return null;
  }

  return (
    <BlueBanner
      title="Recently Viewed"
      items={recentProducts}
      enableHorizontalScroll={true}
      loading={loading}
      error={error}
      renderItem={(item) => (
        <AnimatedCard key={item.id}>
          <div onClick={() => handleClick(item)} className="cursor-pointer">
            <BestSellerCard {...item} />
          </div>
        </AnimatedCard>
      )}
      showButton={false}
    />
  );
}
