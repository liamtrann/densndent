// src/components/RecentlyViewedSection.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BestSellerCard, AnimatedCard } from "common";
import BlueBanner from "./BlueBanner";

export default function RecentlyViewedSection() {
  // const navigate = useNavigate();
  // const items = useSelector((state) => state.recentlyViewed.items);

  // if (!items || items.length === 0) return null;

  // const handleClick = (item) => {
  //   navigate(`/product/${item.id}`);
  // };

  return (
    // <BlueBanner
    //   title="Recently Viewed"
    //   items={items}
    //   enableHorizontalScroll={true}
    //   renderItem={(item) => (
    //     <AnimatedCard>
    //       <div onClick={() => handleClick(item)} className="cursor-pointer">
    //         <BestSellerCard {...item} />
    //       </div>
    //     </AnimatedCard>
    //   )}
    //   showButton={false}
    // />
    <></>
  );
}
