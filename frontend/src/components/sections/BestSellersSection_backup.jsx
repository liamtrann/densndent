import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import {
  BestSellerCard,
  AnimatedCard,
  SectionTitle,
  Loading,
  ErrorMessage,
} from "common";
import { fetchBestSellers } from "../../redux/slices/bestSellersSlice";
import { STATUS } from "../../redux/status";
import { delayCall } from "api/util";
import "react-horizontal-scrolling-menu/dist/styles.css";
import "./BestSellersSection.css";

// Simplified Left Arrow Component
function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } =
    React.useContext(VisibilityContext);

  return (
    <button
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
      className={`hidden md:flex p-2 mx-2 rounded-full shadow-md transition-all duration-200 z-10 items-center justify-center ${
        isFirstItemVisible
          ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
          : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg"
      }`}
      style={{ minWidth: "40px", height: "40px" }}
      aria-label="Scroll left"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
      </svg>
    </button>
  );
}

// Simplified Right Arrow Component
function RightArrow() {
  const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

  return (
    <button
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
      className={`hidden md:flex p-2 mx-2 rounded-full shadow-md transition-all duration-200 z-10 items-center justify-center ${
        isLastItemVisible
          ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
          : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg"
      }`}
      style={{ minWidth: "40px", height: "40px" }}
      aria-label="Scroll right"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      </svg>
    </button>
  );
}

// Individual Best Seller Item Component
function BestSellerItem({ item, onClick }) {
  if (!item) return null;

  return (
    <div
      className="flex-shrink-0 mx-2 select-none"
      style={{
        width: "200px",
        minWidth: "200px",
      }}
    >
      <AnimatedCard>
        <div
          onClick={() => onClick && onClick(item)}
          className="cursor-pointer h-full"
        >
          <BestSellerCard {...item} />
        </div>
      </AnimatedCard>
    </div>
  );
}

export default function BestSellersSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Safe selector with fallbacks
  const bestSellersState = useSelector((state) => state?.bestSellers || {});
  const bestSellers = bestSellersState?.items || [];
  const status = bestSellersState?.status;
  const error = bestSellersState?.error;

  useEffect(() => {
    if (dispatch && fetchBestSellers) {
      return delayCall(() => dispatch(fetchBestSellers()));
    }
  }, [dispatch]);

  const handleClick = (item) => {
    if (item && item.id && navigate) {
      navigate(`/product/${item.id}`);
    }
  };

  if (status === STATUS.LOADING) {
    return (
      <section className="py-8">
        <SectionTitle>Best Sellers</SectionTitle>
        <div className="bg-white px-6 py-8">
          <Loading text="Loading best sellers..." />
        </div>
      </section>
    );
  }

  if (status === STATUS.FAILED) {
    return (
      <section className="py-8">
        <SectionTitle>Best Sellers</SectionTitle>
        <div className="bg-white px-6 py-8">
          <ErrorMessage message={error || "Failed to load best sellers"} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <SectionTitle>Best Sellers</SectionTitle>
      <div className="bg-white px-6 py-8">
        {Array.isArray(bestSellers) && bestSellers.length > 0 ? (
          <div className="relative">
            <ScrollMenu
              LeftArrow={LeftArrow}
              RightArrow={RightArrow}
              wrapperClassName="w-full"
              scrollContainerClassName="flex items-center gap-0 pb-4"
              itemClassName="flex-shrink-0"
            >
              {bestSellers.map((item, index) => (
                <BestSellerItem
                  key={item?.id || `item-${index}`}
                  itemId={item?.id?.toString() || `item-${index}`}
                  item={item}
                  onClick={handleClick}
                />
              ))}
            </ScrollMenu>

            {/* Mobile scroll hint */}
            <div className="md:hidden text-center mt-2 text-sm text-gray-500">
              ← Swipe to see more →
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No best sellers available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}
