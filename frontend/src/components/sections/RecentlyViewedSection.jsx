// src/components/RecentlyViewedSection.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BestSellerCard, AnimatedCard, TitleSection } from "common";
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
    <>
      <TitleSection
        title="Recently Viewed"
        subtitle="Continue where you left off"
        itemCount={recentProducts.length}
        itemLabel="items"
        colorScheme="blue"
        icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 616 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        }
      />
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
    </>
  );
}
