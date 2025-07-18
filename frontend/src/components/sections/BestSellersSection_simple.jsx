import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

// Simple scroll arrows
function ScrollArrow({ direction, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`hidden md:flex p-2 mx-2 rounded-full shadow-md transition-all duration-200 z-10 items-center justify-center ${
        disabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
          : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg"
      }`}
      style={{ minWidth: "40px", height: "40px" }}
      aria-label={`Scroll ${direction}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        {direction === "left" ? (
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        ) : (
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        )}
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
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -240, // Scroll by approximately one item width
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 240, // Scroll by approximately one item width
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    updateScrollButtons();

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [bestSellers]);

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
            <div className="flex items-center">
              <ScrollArrow
                direction="left"
                onClick={scrollLeft}
                disabled={!canScrollLeft}
              />

              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 gap-0 pb-4 flex-1"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#cbd5e0 #f7fafc",
                  overscrollBehavior: "contain",
                }}
                onScroll={updateScrollButtons}
              >
                {bestSellers.map((item, index) => (
                  <BestSellerItem
                    key={item?.id || `item-${index}`}
                    item={item}
                    onClick={handleClick}
                  />
                ))}
              </div>

              <ScrollArrow
                direction="right"
                onClick={scrollRight}
                disabled={!canScrollRight}
              />
            </div>

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
