// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { addToCart } from "store/slices/cartSlice";

import api from "api/api";
import endpoint from "api/endpoints";
import { delayCall } from "api/util";
import { Toast } from "common";
import {
  Loading,
  ErrorMessage,
  ProductImage,
  Paragraph,
  InputField,
  Button,
  ShowMoreHtml,
  Dropdown,
  DeliveryEstimate,
  WeekdaySelector,
  FavoriteButton,
} from "common";
import { Modal } from "components";
import {
  getMatrixInfo,
  formatCurrency,
  useQuantityHandlers,
} from "config/config";

import PurchaseOptions from "../common/ui/PurchaseOptions";
import RecentlyViewedSection from "../components/sections/RecentlyViewedSection";
import { useRecentViews } from "../hooks/useRecentViews";
import { addToRecentViews } from "../redux/slices/recentViewsSlice";

// ✅ Reusable purchase control

import { CURRENT_IN_STOCK, OUT_OF_STOCK } from "@/constants/constant";

/* ===== Date helpers (local) ===== */
function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}
function addMonthsSafe(date, months) {
  const d = new Date(date.getTime());
  const day = d.getDate();
  const targetMonth = d.getMonth() + months;
  const targetYear = d.getFullYear() + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  const endDay = daysInMonth(targetYear, normalizedMonth);
  const clamped = Math.min(day, endDay);
  const res = new Date(d);
  res.setFullYear(targetYear, normalizedMonth, clamped);
  return res;
}
function formatLocalDateToronto(date) {
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/Toronto",
  });
}
function nextSubscriptionDateFromToday(intervalStr) {
  const interval = parseInt(intervalStr || "1", 10);
  return addMonthsSafe(new Date(), isNaN(interval) ? 1 : interval);
}

export default function ProductsPage({
  productId: propProductId = null,
  isModal = false,
}) {
  const { id: rawId } = useParams();
  // Use prop productId if provided (for modal), otherwise use URL param
  const effectiveRawId = propProductId || rawId;
  const [product, setProduct] = useState(null);
  const [alertModal, setAlertModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [matrixOptions, setMatrixOptions] = useState([]);
  const [selectedMatrixOption, setSelectedMatrixOption] = useState("");

  // ✅ local state for purchase options on PDP
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subInterval, setSubInterval] = useState("1");
  const [preferredDeliveryDays, setPreferredDeliveryDays] = useState([]);

  const { addProductToRecentViews } = useRecentViews();

  const {
    quantity,
    actualQuantity,
    handleQuantityChange,
    increment,
    decrement,
  } = useQuantityHandlers(1, product?.stockdescription);

  /**
   * Resolve any non-numeric :id to a numeric internal id
   * - If it's already numeric, return as-is.
   * - Otherwise, search by name/SKU and return the first hit's id.
   */
  async function resolveProductId(maybeId) {
    const s = String(maybeId || "").trim();

    // If numeric (typical internalid), use directly
    if (/^\d+$/.test(s)) return s;

    const query = decodeURIComponent(s);

    // Try a few forgiving variations to improve hit rate
    const candidates = [
      query,
      query.replace(/\s*-\s*.*/, ""), // drop trailing " - ABC"
      query
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim(), // strip punctuation
    ];

    for (const q of candidates) {
      try {
        // Your backend expects { name: "<search string>" }
        const res = await api.post(
          endpoint.POST_GET_ITEMS_BY_NAME({ limit: 1 }),
          { name: q }
        );
        const arr = Array.isArray(res.data)
          ? res.data
          : res.data?.items || res.data;
        const first = Array.isArray(arr) ? arr[0] : undefined;
        if (first?.id) return String(first.id);
      } catch {
        // keep trying next candidate
      }
    }

    return null;
  }

  // fetch product (with resolving step)
  useEffect(() => {
    let abort = false;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);

        // Resolve non-numeric to numeric id if needed
        const pid = await resolveProductId(effectiveRawId);
        if (!pid) throw new Error("Product not found");

        // Normalize URL to the numeric id for a cleaner/consistent PDP link
        // Only navigate if we're not in modal mode and the ID changed
        if (pid !== effectiveRawId && !isModal) {
          navigate(`/product/${pid}`, { replace: true });
        }

        const res = await api.get(endpoint.GET_PRODUCT_BY_ID(pid));
        if (abort) return;

        setProduct(res.data);
        if (!isModal) {
          dispatch(addToRecentViews(res.data.id));
        }
        // reset PDP subscription UI on product change
        setIsSubscribed(false);
        setSubInterval("1");
        setPreferredDeliveryDays([]);
      } catch (err) {
        if (abort) return;
        setError(err?.response?.data?.error || "Failed to load product.");
      } finally {
        if (!abort) setLoading(false);
      }
    }

    fetchProduct();
    return () => {
      abort = true;
    };
  }, [effectiveRawId, navigate, dispatch, isModal]);

  // fetch matrix/variants
  useEffect(() => {
    if (!product || !product.custitem39) return;
    async function fetchMatrixOptions() {
      try {
        const res = await api.post(endpoint.POST_GET_PRODUCT_BY_PARENT(), {
          parent: product.custitem39,
        });
        setMatrixOptions(res.data || []);
      } catch {
        setMatrixOptions([]);
      }
    }
    delayCall(fetchMatrixOptions);
  }, [product]);

  useEffect(() => {
    if (product) setSelectedMatrixOption(product.id);
  }, [product]);

  useEffect(() => {
    if (effectiveRawId && !isModal) {
      addProductToRecentViews(effectiveRawId);
    }
  }, [effectiveRawId, addProductToRecentViews, isModal]);

  const handleAddToCart = () => {
    if (!product) return;
    const cartItem = {
      ...product,
      quantity: Number(actualQuantity),
      // ✅ carry PDP subscription choice into cart
      subscriptionEnabled: isSubscribed,
      subscriptionInterval: isSubscribed ? subInterval : null,
      subscriptionPreferredDeliveryDays: isSubscribed
        ? preferredDeliveryDays
        : null,
    };

    delayCall(() => {
      dispatch(addToCart(cartItem));
      Toast.success(`Added ${actualQuantity} ${product.itemid} to cart!`);
      // Call the callback if provided (for modal close)
    });
  };

  const { matrixType, options: matrixOptionsList } =
    getMatrixInfo(matrixOptions);

  if (loading) return <Loading text="Loading product..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

  // compute first delivery date preview
  const firstDeliveryDate = isSubscribed
    ? nextSubscriptionDateFromToday(subInterval)
    : null;

  return (
    <div className={isModal ? "relative" : "max-w-6xl mx-auto px-6 py-10"}>
      {isModal && (
        <div className="absolute top-9 right-4 z-10">
          <FavoriteButton itemId={product.id} size={22} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="overflow-hidden">
          <ProductImage
            src={product.file_url}
            className={`w-full object-contain transition-transform duration-300 ease-in-out ${
              isModal ? "hover:scale-110" : "hover:scale-150 cursor-zoom-in"
            }`}
          />
        </div>

        <div>
          <h2
            className={`${isModal ? "text-xl" : "text-2xl"} font-bold text-gray-800 mb-2`}
          >
            {product.itemid}
          </h2>

          {product.totalquantityonhand && product.totalquantityonhand > 0 ? (
            <div className="mb-2">
              <Paragraph className="text-smiles-blue font-semibold">
                {CURRENT_IN_STOCK}: {product.totalquantityonhand}
              </Paragraph>
              <DeliveryEstimate inStock={true} size="default" />
            </div>
          ) : (
            <div className="mb-2">
              <Paragraph className="text-smiles-orange font-semibold">
                {OUT_OF_STOCK}
              </Paragraph>
              <DeliveryEstimate inStock={false} size="default" />
            </div>
          )}

          <div className="mt-2 mb-4">
            {product.price ? (
              product.promotioncode_id && product.fixedprice ? (
                <div className="space-y-2">
                  {/* Promotion badge */}
                  <div className="mb-2">
                    <span className="text-sm text-white font-medium bg-smiles-redOrange px-3 py-1 rounded">
                      PROMO: {product.promotion_code}
                    </span>
                  </div>
                  {/* Original price - strikethrough */}
                  <div className="text-gray-500 line-through text-lg">
                    {formatCurrency(product.price)}
                  </div>
                  {/* Promotional price */}
                  <div className="text-red-600 font-bold text-3xl">
                    {formatCurrency(product.fixedprice)}
                  </div>
                  {/* Savings amount */}
                  <div className="text-green-600 text-lg font-medium">
                    Save {formatCurrency(product.price - product.fixedprice)}
                  </div>
                </div>
              ) : (
                <div className="text-3xl font-bold text-gray-800">
                  {formatCurrency(product.price)}
                </div>
              )
            ) : null}
          </div>

          {product.storedetaileddescription && (
            <ShowMoreHtml
              html={product.storedetaileddescription}
              maxLength={400}
            />
          )}

          <div className="text-sm text-gray-500 mt-4">MPN: {product.mpn}</div>

          {matrixOptions.length > 0 && (
            <Dropdown
              label={matrixType}
              options={matrixOptionsList}
              value={selectedMatrixOption}
              key={selectedMatrixOption.value}
              onChange={(e) => {
                setSelectedMatrixOption(e.target.value);
                if (e.target.value && e.target.value !== product.id) {
                  navigate(`/product/${e.target.value}`);
                }
              }}
              className="w-48"
            />
          )}

          {/* Quantity */}
          <div className="mt-4">
            <label className="block mb-1 font-medium">Quantity:</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded overflow-hidden h-9 w-32">
                <button
                  onClick={decrement}
                  className="px-2 h-9 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={Number(quantity) <= 1}
                >
                  –
                </button>
                <InputField
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="flex-1 h-9 text-center text-sm border-0 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={increment}
                  className="px-2 h-9 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  +
                </button>
              </div>

              {product.stockdescription && (
                <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                  {product.stockdescription}
                </span>
              )}
            </div>

            {actualQuantity > quantity && (
              <div className="mt-2 text-sm">
                <span className="text-gray-600">
                  Selected: {quantity} items
                </span>
                <span className="text-green-600 font-medium ml-2">
                  → Total with bonus: {actualQuantity} items
                </span>
              </div>
            )}
          </div>

          {/* ✅ Purchase options (PDP) */}
          <div className="mt-5">
            <PurchaseOptions
              name={`pdp-${product.id}`}
              isSubscribed={isSubscribed}
              interval={subInterval}
              onOneTime={() => {
                setIsSubscribed(false);
                setPreferredDeliveryDays([]);
              }}
              onSubscribe={() => {
                setIsSubscribed(true);
                // Set default preferred delivery days to weekdays only (Mon-Fri)
                if (preferredDeliveryDays.length === 0) {
                  setPreferredDeliveryDays([1, 2, 3, 4, 5]);
                }
              }}
              onIntervalChange={(val) => setSubInterval(val)}
            />

            {/* Preferred delivery days when subscribed */}
            {isSubscribed && (
              <div className="mt-4">
                <WeekdaySelector
                  label="Preferred delivery days"
                  selectedDays={preferredDeliveryDays}
                  onChange={setPreferredDeliveryDays}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 mt-2">
                  Select the days you prefer to receive your subscription
                  deliveries
                </div>
              </div>
            )}

            {/* date preview when subscribed */}
            {isSubscribed && (
              <div className="mt-3 text-xs text-gray-600">
                <span className="font-medium">Next order:</span>{" "}
                <span>{formatLocalDateToronto(firstDeliveryDate)}</span>
                <span className="ml-1">
                  (
                  {subInterval === "1"
                    ? "every 1 month"
                    : `every ${subInterval} months`}
                  )
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <Button className={`mt-6 w-full`} onClick={handleAddToCart}>
            Add to Shopping Cart
          </Button>
        </div>
      </div>

      {/* Alert Modal for stock limit */}
      {alertModal && (
        <Modal
          title="Stock Limit Exceeded"
          onClose={() => setAlertModal(false)}
          onCloseText="OK"
        >
          <p>
            Sorry, only {product.totalquantityonhand} in stock. Please adjust
            your quantity.
          </p>
        </Modal>
      )}

      {/* ✅ Recently Viewed Products Carousel - Only show on full page, not in modal */}
      {!isModal && (
        <div className="mt-20">
          <RecentlyViewedSection />
        </div>
      )}
    </div>
  );
}
