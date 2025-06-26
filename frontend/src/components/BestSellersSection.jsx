import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BestSellerCard, AnimatedCard } from '../common';
import BlueBanner from "./BlueBanner";
import { fetchBestSellers } from '../redux/slices/bestSellersSlice';
import { STATUS } from '../redux/status';

export default function BestSellersSection() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: bestSellers, status, error } = useSelector(state => state.bestSellers);

    useEffect(() => {
        dispatch(fetchBestSellers());
    }, [dispatch]);

    const handleClick = (item) => {
        navigate(`/product/${item.id}`);
    };

    return (
        <BlueBanner
            title="Best Sellers"
            items={bestSellers}
            renderItem={(item) => (
                <AnimatedCard>
                    <div onClick={() => handleClick(item)} className="cursor-pointer">
                        <BestSellerCard {...item} />
                    </div>
                </AnimatedCard>
            )}
            showButton={false}
            loading={status === STATUS.LOADING}
            error={status === STATUS.FAILED ? error : null}
            gridClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 auto-rows-fr"
        />
    );
}
