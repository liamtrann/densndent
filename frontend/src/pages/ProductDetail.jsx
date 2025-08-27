// src/pages/ProductDetail.jsx
import React, { useState, useEffect, useMemo } from "react";
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

import { CURRENT_IN_STOCK, OUT_OF_STOCK } from "@/constants/constant";

/* ──────────────────────────────────────────────────────────────────────────
   Date & weekday utilities
   ────────────────────────────────────────────────────────────────────────── */
const DateUtils = {
  daysInMonth: (y, m) => new Date(y, m + 1, 0).getDate(),
  addMonthsSafe(date, months) {
    const d = new Date(date.getTime());
    const day = d.getDate();
    const targetMonth = d.getMonth() + months;
    const targetYear = d.getFullYear() + Math.floor(targetMonth / 12);
    const normalizedMonth = ((targetMonth % 12) + 12) % 12;
    const endDay = this.daysInMonth(targetYear, normalizedMonth);
    const clamped = Math.min(day, endDay);
    const res = new Date(d);
    res.setFullYear(targetYear, normalizedMonth, clamped);
    return res;
  },
  toInput(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  },
  fmtToronto(d) {
    return d.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "America/Toronto",
    });
  },
  nextSubscriptionDateFromToday(intervalStr) {
    const interval = parseInt(intervalStr || "1", 10);
    return this.addMonthsSafe(new Date(), isNaN(interval) ? 1 : interval);
  },
};

const DOW_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // Mon index 0..6
const jsIdxFromMonIdx = (monIdx) => (monIdx + 1) % 7; // Mon0..Sun6 -> JS Sun0..Sat6
const monIdxFromJsIdx = (jsIdx) => (jsIdx + 6) % 7; // JS Sun0..Sat6 -> Mon0..Sun6
function nextDateForWeekdayFrom(baseDate, monIdx) {
  const jsTarget = jsIdxFromMonIdx(monIdx);
  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const diff = (jsTarget - start.getDay() + 7) % 7;
  const result = new Date(start);
  result.setDate(start.getDate() + diff);
  return result;
}

/* ──────────────────────────────────────────────────────────────────────────
   Small, reusable UI pieces
   ────────────────────────────────────────────────────────────────────────── */
function StockBlock({ inStockQty }) {
  const inStock = !!inStockQty && inStockQty > 0;
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
          >
            –
          </button>
          <InputField
            type="number"
            min="1"
            value={quantity}
            onChange={onChange}
            className="flex-1 h-9 text-center text-sm border-0 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={onInc}
            className="px-2 h-9 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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

function WeekdayPicker({ valueMonIdx, onChange }) {
  return (
    <div>
      <div className="block text-sm font-medium mb-2">Preferred delivery day</div>
      <div className="flex items-end gap-6">
        {DOW_LABELS.map((lbl, i) => (
          <div key={lbl} className="flex flex-col items-center">
            <div className="text-sm mb-1">{lbl}</div>
            {/* Checkbox visuals; single-select behavior */}
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={valueMonIdx === i}
              onChange={() => onChange(i)}
              aria-label={`Choose ${lbl} delivery`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────────────────── */
export default function ProductsPage({
  productId: propProductId = null,
  isModal = false,
  onAddToCart: onAddToCartCallback = null,
}) {
  const { id: rawId } = useParams();
  const effectiveRawId = propProductId || rawId;

  const [product, setProduct] = useState(null);
  const [alertModal, setAlertModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [matrixOptions, setMatrixOptions] = useState([]);
  const [selectedMatrixOption, setSelectedMatrixOption] = useState("");

  // PDP subscription controls
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subInterval, setSubInterval] = useState("1");
  const [subStatus, setSubStatus] = useState("active"); // "active" | "paused"
  const [subDate, setSubDate] = useState(
    DateUtils.toInput(DateUtils.nextSubscriptionDateFromToday("1"))
  );
  const [dateTouched, setDateTouched] = useState(false);
  const [preferredDow, setPreferredDow] = useState(
    monIdxFromJsIdx(new Date().getDay())
  );

  const { addProductToRecentViews } = useRecentViews();

  const {
    quantity,
    actualQuantity,
    handleQuantityChange,
    increment,
    decrement,
  } = useQuantityHandlers(1, product?.stockdescription);

  const priceDisplay = useMemo(
    () => (product?.price ? formatCurrency(product.price) : null),
    [product?.price]
  );

  /** Resolve any non-numeric :id to a numeric internal id */
  async function resolveProductId(maybeId) {
    const s = String(maybeId || "").trim();
    if (/^\d+$/.test(s)) return s;

    const query = decodeURIComponent(s);
    const candidates = [
      query,
      query.replace(/\s*-\s*.*/, ""),
      query.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim(),
    ];

    for (const q of candidates) {
      try {
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
        /* keep trying next candidate */
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

        const pid = await resolveProductId(effectiveRawId);
        if (!pid) throw new Error("Product not found");

        if (pid !== effectiveRawId && !isModal) {
          navigate(`/product/${pid}`, { replace: true });
        }

        const res = await api.get(endpoint.GET_PRODUCT_BY_ID(pid));
        if (abort) return;

        setProduct(res.data);
        if (!isModal) dispatch(addToRecentViews(res.data.id));

        // reset PDP subscription UI on product change
        setIsSubscribed(false);
        setSubInterval("1");
        setSubStatus("active");
        const initial = DateUtils.nextSubscriptionDateFromToday("1");
        setSubDate(DateUtils.toInput(initial));
        setDateTouched(false);
        setPreferredDow(monIdxFromJsIdx(initial.getDay()));
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
    if (!product?.custitem39) return;
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
  }, [product?.custitem39]);

  useEffect(() => {
    if (product) setSelectedMatrixOption(product.id);
  }, [product]);

  useEffect(() => {
    if (effectiveRawId) addProductToRecentViews(effectiveRawId);
  }, [effectiveRawId, addProductToRecentViews]);

  // When interval changes and user hasn't edited date, move the next date accordingly
  useEffect(() => {
    if (isSubscribed && !dateTouched) {
      const suggested = DateUtils.nextSubscriptionDateFromToday(subInterval);
      setSubDate(DateUtils.toInput(suggested));
      setPreferredDow(monIdxFromJsIdx(suggested.getDay()));
    }
  }, [subInterval, isSubscribed, dateTouched]);

  // Keep preferred weekday synced to manual date changes
  useEffect(() => {
    if (!subDate) return;
    const jsIdx = new Date(subDate).getDay();
    setPreferredDow(monIdxFromJsIdx(jsIdx));
  }, [subDate]);

  /* ─────────── Add to cart ─────────── */
  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      ...product,
      quantity: Number(actualQuantity),
      // PDP subscription selections carried into cart
      subscriptionEnabled: isSubscribed,
      subscriptionInterval: isSubscribed ? subInterval : null,
      subscriptionNextDate: isSubscribed ? subDate : null, // YYYY-MM-DD
      subscriptionStatus: isSubscribed ? subStatus : null, // "active" | "paused"
      subscriptionPreferredDow: isSubscribed ? DOW_LABELS[preferredDow] : null, // "Mon".."Sun"
    };

    delayCall(() => {
      dispatch(addToCart(cartItem));
      Toast.success(`Added ${actualQuantity} ${product.itemid} to cart!`);
      if (onAddToCartCallback) onAddToCartCallback();
    });
  };

  const { matrixType, options: matrixOptionsList } = getMatrixInfo(matrixOptions);

  if (loading) return <Loading text="Loading product..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

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
                setPreferredDow(monIdxFromJsIdx(suggested.getDay()));
                setDateTouched(false);
              }}
              onIntervalChange={(val) => setSubInterval(val)}
            />

            {isSubscribed && (
              <div className="mt-3 space-y-4">
                {/* Next order date + subscription status */}
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Next order date</label>
                    <input
                      type="date"
                      className="h-9 border rounded px-2 text-sm"
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

                  <div className="w-56">
                    <Dropdown
                      label="Subscription"
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

      {/* Alert Modal */}
      {alertModal && (
        <Modal title="Stock Limit Exceeded" onClose={() => setAlertModal(false)} onCloseText="OK">
          <p>Sorry, only {product.totalquantityonhand} in stock. Please adjust your quantity.</p>
        </Modal>
      )}

      {!isModal && (
        <div className="mt-20">
          <RecentlyViewedSection />
        </div>
      )}
    </div>
  );
}
