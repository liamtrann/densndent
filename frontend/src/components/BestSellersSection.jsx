import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BestSellerCard } from '../common';
import BlueBanner from "./BlueBanner";
import { fetchBestSellers } from '../redux/slices/bestSellersSlice';
import { STATUS } from '../redux/status';

export default function BestSellersSection() {
  const dispatch = useDispatch();
  const { items: bestSellers, status, error } = useSelector(state => state.bestSellers);

  useEffect(() => {
    dispatch(fetchBestSellers());
  }, [dispatch]);

  console.log(status)

  return (
    <BlueBanner
      title="Best Sellers"
      items={bestSellers}
      columns={{ base: 2, md: 4, lg: 6 }}
      renderItem={(item) => <BestSellerCard {...item} />}
      showButton={false}
      loading={status === STATUS.LOADING}
      error={status === STATUS.FAILED ? error : null}
    />
  );
}
