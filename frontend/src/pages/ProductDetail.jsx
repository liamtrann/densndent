// src/pages/ProductDetail.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "store/slices/cartSlice";

import {
  Loading,
  ProductImage,
  Paragraph,
  InputField,
  Button,
  ShowMoreHtml,
  Dropdown,
  DeliveryEstimate,
} from "common";
import { getMatrixInfo, useQuantityHandlers } from "config/config";
import PurchaseOptions from "../common/ui/PurchaseOptions";
import RecentlyViewedSection from "../components/sections/RecentlyViewedSection";

import useProductDetail from "../hooks/useProductDetail";
import { CURRENT_IN_STOCK, OUT_OF_STOCK } from "@/constants/constant";

/* Small local UI atoms */
function StockBlock({ inStockQty }) {
  const inStock = Number(inStockQty) > 0;
  return inStock ? (
    <div className="mb-2">
      <Paragraph className="text-smiles-blue font-semibold">
        {CURRENT_IN_STOCK}: {inStockQty}
      </Paragraph>
      <DeliveryEstimate inStock size="default" />
    </div>
  ) : (
    <div className="mb-2">
      <Paragraph className="text-smiles-orange font-semibold">
        {OUT_OF_STOCK}
      </Paragraph>
      <DeliveryEstimate inStock={false} size="default" />
    </div>
  );
}

function QuantityInput({ quantity, onChange, onDec, onInc, badge }) {
  return (
    <div className="mt-4">
      <label className="block mb-1 font-medium">Quantity:</label>
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded overflow-hidden h-9 w-32">
          <button
            onClick={onDec}
            className="px-2 h-9 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={Number(quantity) <= 1}
            aria-label="Decrease quantity"
          >
            –
          </button>
          <InputField
            type="number"
            min="1"
            value={quantity}
            onChange={onChange}
            className="flex-1 h-9 text-center text-sm border-0 focus:ring-1 focus:ring-blue-500"
            aria-label="Quantity"
          />
          <button
            onClick={onInc}
            className="px-2 h-9 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {!!badge && (
          <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

function MatrixDropdown({ matrixType, options, value, onChange }) {
  if (!options?.length) return null;
  return (
    <Dropdown
      label={matrixType}
      options={options}
      value={value}
      onChange={onChange}
      className="w-48"
    />
  );
}

function WeekdayPicker({ labels, valueMonIdx, onChange }) {
  return (
    <div>
      <div className="block text-sm font-medium mb-2">Preferred delivery day</div>
      <div className="flex items-end gap-6">
        {labels.map((lbl, i) => (
          <label key={lbl} className="flex flex-col items-center cursor-pointer">
            <div className="text-sm mb-1">{lbl}</div>
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={valueMonIdx === i}
              onChange={() => onChange(i)}
              aria-label={`Choose ${lbl} delivery`}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage({ productId: propProductId = null, isModal = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    product,
    matrixOptions,
    selectedMatrixOption,
    setSelectedMatrixOption,

    isSubscribed,
    setIsSubscribed,
    subInterval,
    setSubInterval,
    subStatus,
    setSubStatus,
    subDate,
    setSubDate,
    dateTouched,
    setDateTouched,
    preferredDow,
    setPreferredDow,

    priceDisplay,

    DOW_LABELS,
    DateUtils,
    nextDateForWeekdayFrom,
  } = useProductDetail({ productId: propProductId, isModal });

  const { matrixType, options: matrixOptionsList } = getMatrixInfo(matrixOptions);

  const {
    quantity,
    actualQuantity,
    handleQuantityChange,
    increment,
    decrement,
  } = useQuantityHandlers(1, product?.stockdescription);

  if (!product) return <Loading text="Loading product..." />;

  /* add to cart (unchanged behavior) */
  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      quantity: Number(actualQuantity),
      subscriptionEnabled: isSubscribed,
      subscriptionInterval: isSubscribed ? subInterval : null,
      subscriptionNextDate: isSubscribed ? subDate : null, // YYYY-MM-DD
      subscriptionStatus: isSubscribed ? subStatus : null, // "active" | "paused"
      subscriptionPreferredDow: isSubscribed ? DOW_LABELS[preferredDow] : null,
    };
    dispatch(addToCart(cartItem));
  };

  return (
    <div className={isModal ? "" : "max-w-6xl mx-auto px-6 py-10"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* IMAGE */}
        <div className="overflow-hidden">
          <ProductImage
            src={product.file_url}
            className={`w-full object-contain transition-transform duration-300 ease-in-out ${
              isModal ? "hover:scale-110" : "hover:scale-150 cursor-zoom-in"
            }`}
          />
        </div>

        {/* DETAILS */}
        <div>
          <h2 className={`${isModal ? "text-xl" : "text-2xl"} font-bold text-gray-800 mb-2`}>
            {product.itemid}
          </h2>

          <StockBlock inStockQty={product.totalquantityonhand} />

          <div className="mt-2 mb-4">
            {priceDisplay && <div className="text-3xl font-bold text-gray-800">{priceDisplay}</div>}
          </div>

          {product.storedetaileddescription && (
            <ShowMoreHtml html={product.storedetaileddescription} maxLength={400} />
          )}

          <div className="text-sm text-gray-500 mt-4">MPN: {product.mpn}</div>

          <MatrixDropdown
            matrixType={matrixType}
            options={matrixOptionsList}
            value={selectedMatrixOption}
            onChange={(e) => {
              setSelectedMatrixOption(e.target.value);
              if (e.target.value && e.target.value !== product.id) {
                navigate(`/product/${e.target.value}`);
              }
            }}
          />

          <QuantityInput
            quantity={quantity}
            onChange={handleQuantityChange}
            onDec={decrement}
            onInc={increment}
            badge={product.stockdescription}
          />

          {/* Subscribe & Save */}
          <div className="mt-5">
            <PurchaseOptions
              name={`pdp-${product.id}`}
              isSubscribed={isSubscribed}
              interval={subInterval}
              onOneTime={() => setIsSubscribed(false)}
              onSubscribe={() => {
                setIsSubscribed(true);
                const suggested = DateUtils.nextSubscriptionDateFromToday(subInterval);
                setSubDate(DateUtils.toInput(suggested));
                setPreferredDow(((suggested.getDay() + 6) % 7)); // monIdxFromJsIdx inline to avoid another import
                setDateTouched(false);
              }}
              onIntervalChange={(val) => setSubInterval(val)}
            />

            {isSubscribed && (
              <div className="mt-3 space-y-4">
                {/* Next order date + subscription (aligned) */}
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                  {/* Date */}
                  <div className="w-56">
                    <label className="block text-sm font-medium mb-1">Next order date</label>
                    <InputField
                      type="date"
                      className="h-9 border rounded px-2 text-sm w-full"
                      value={subDate}
                      onChange={(e) => {
                        setSubDate(e.target.value);
                        setDateTouched(true);
                      }}
                      aria-label="Choose next order date"
                    />
                    <div className="text-[11px] text-gray-500 mt-1">
                      ({DateUtils.fmtToronto(new Date(subDate))})
                    </div>
                  </div>

                  {/* Subscription status */}
                  <div className="w-56">
                    <label className="block text-sm font-medium mb-1">Subscription</label>
                    <Dropdown
                      label=""
                      value={subStatus}
                      onChange={(e) => setSubStatus(e.target.value)}
                      options={[
                        { value: "active", label: "Active" },
                        { value: "paused", label: "Pause" },
                      ]}
                      className="h-9 text-sm w-full"
                      wrapperClassName="mb-0"
                    />
                  </div>
                </div>

                {/* Preferred delivery weekday */}
                <WeekdayPicker
                  labels={DOW_LABELS}
                  valueMonIdx={preferredDow}
                  onChange={(monIdx) => {
                    setPreferredDow(monIdx);
                    const next = nextDateForWeekdayFrom(new Date(), monIdx);
                    setSubDate(DateUtils.toInput(next));
                    setDateTouched(true);
                  }}
                />
              </div>
            )}
          </div>

          <Button className="mt-6 w-full" onClick={handleAddToCart}>
            Add to Shopping Cart
          </Button>
        </div>
      </div>

      {!isModal && (
        <div className="mt-20">
          <RecentlyViewedSection />
        </div>
      )}
    </div>
  );
}
