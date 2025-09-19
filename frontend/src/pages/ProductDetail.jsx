// src/pages/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { addToCart } from "store/slices/cartSlice";
import {
  addToFavorites,
  removeFromFavorites,
} from "store/slices/favoritesSlice";

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
  FavoriteButton,
  PreferDeliveryDaySelector,
} from "common";
import { Modal } from "components";
import {
  getMatrixInfo,
  formatCurrency,
  useQuantityHandlers,
  preferredDaysTextFromSources,
} from "config/config";

import PurchaseOptions from "../common/ui/PurchaseOptions";
import RecentlyViewedSection from "../components/sections/RecentlyViewedSection";
import { useRecentViews } from "../hooks/useRecentViews";
import { addToRecentViews } from "../redux/slices/recentViewsSlice";

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
  const effectiveRawId = propProductId || rawId;

  const { getAccessTokenSilently } = useAuth0();

  const userInfo = useSelector((s) => s.user.info);
  const favorites = useSelector((s) => s.favorites.items);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [matrixOptions, setMatrixOptions] = useState([]);
  const [selectedMatrixOption, setSelectedMatrixOption] = useState("");

  // PDP purchase options
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subInterval, setSubInterval] = useState("1");

  const { addProductToRecentViews } = useRecentViews();

  const {
    quantity,
    actualQuantity,
    handleQuantityChange,
    increment,
    decrement,
  } = useQuantityHandlers(1, product?.stockdescription);

  async function resolveProductId(maybeId) {
    const s = String(maybeId || "").trim();
    if (/^\d+$/.test(s)) return s;

    const query = decodeURIComponent(s);
    const candidates = [
      query,
      query.replace(/\s*-\s*.*/, ""),
      query
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
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
        // ignore and try next
      }
    }
    return null;
  }

  // fetch product
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

        setIsSubscribed(false);
        setSubInterval("1");
      } catch (err) {
        if (!abort)
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

  // variants
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
      subscriptionEnabled: isSubscribed,
      subscriptionInterval: isSubscribed ? subInterval : null,
      subscriptionPreferredDeliveryDays: isSubscribed
        ? preferredDaysTextFromSources({ userInfo })
        : null,
    };
    delayCall(() => {
      dispatch(addToCart(cartItem));
      Toast.success(`Added ${actualQuantity} ${product.itemid} to cart!`);
    });
  };

  // ===== Favorites helpers (for the text button) =====
  const isFavorite = product ? favorites.includes(Number(product.id)) : false;

  const toggleFavorite = async () => {
    if (!product || !userInfo?.id) return;
    const payload = {
      itemId: Number(product.id),
      userId: userInfo.id,
      getAccessTokenSilently,
    };
    if (isFavorite) {
      dispatch(removeFromFavorites(payload));
    } else {
      dispatch(addToFavorites(payload));
    }
  };

  const { matrixType, options: matrixOptionsList } =
    getMatrixInfo(matrixOptions);

  if (loading) return <Loading text="Loading product..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

  const firstDeliveryDate = isSubscribed
    ? nextSubscriptionDateFromToday(subInterval)
    : null;

  return (
    <div className={isModal ? "" : "max-w-6xl mx-auto px-6 py-10"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Image */}
        <div className="overflow-hidden">
          <ProductImage
            src={product.file_url}
            className={`w-full object-contain transition-transform duration-300 ease-in-out ${
              isModal ? "hover:scale-110" : "hover:scale-150 cursor-zoom-in"
            }`}
          />
        </div>

        {/* Right: Content */}
        <div>
          {/* Title (removed hearts here; we’re putting them near Quantity as requested) */}
          <h2
            className={`${isModal ? "text-xl" : "text-2xl"} font-bold text-gray-800 mb-2`}
          >
            {product.itemid}
          </h2>

          {/* Stock status */}
          {Number(product.totalquantityonhand) > 0 ? (
            <div className="mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium">
                {CURRENT_IN_STOCK}: {product.totalquantityonhand}
              </span>
              <DeliveryEstimate
                inStock={true}
                size="default"
                className="mt-1 rounded"
              />
            </div>
          ) : (
            <div className="mb-2">
              <DeliveryEstimate
                inStock={false}
                size="default"
                className="mt-1 rounded"
              />
            </div>
          )}

          {/* Price */}
          <div className="mt-2 mb-4">
            {product.price ? (
              product.promotioncode_id && product.fixedprice ? (
                <div className="space-y-2">
                  <div className="mb-2">
                    <span className="text-sm text-white font-medium bg-smiles-redOrange px-3 py-1 rounded">
                      PROMO: {product.promotion_code}
                    </span>
                  </div>
                  <div className="text-gray-500 line-through text-lg">
                    {formatCurrency(product.price)}
                  </div>
                  <div className="text-red-600 font-bold text-3xl">
                    {formatCurrency(product.fixedprice)}
                  </div>
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

          {/* Description */}
          {product.storedetaileddescription && (
            <ShowMoreHtml
              html={product.storedetaileddescription}
              maxLength={400}
            />
          )}
          <div className="text-sm text-gray-500 mt-4">MPN: {product.mpn}</div>

          {/* Variants */}
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

          {/* ===== Quantity + Favorites row ===== */}
          <div className="mt-4">
            <label className="block mb-1 font-medium">Quantity:</label>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Qty control */}
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

              {/* Any stockdescription badge */}
              {product.stockdescription && (
                <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                  {product.stockdescription}
                </span>
              )}

              {/* ➜ Favorites controls live here */}
              {userInfo?.id && (
                <div className="flex items-center gap-2 ml-auto">
                  <FavoriteButton itemId={product.id} size={20} />
                  <div
                    onClick={toggleFavorite}
                    className={`h-9 px-3 border border-gray-300 bg-gray-100 text-gray-800 hover:bg-smiles-blue hover:text-white flex items-center justify-center cursor-pointer select-none text-sm`}
                  >
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </div>
                </div>
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

          {/* Purchase options */}
          <div className="mt-5">
            <PurchaseOptions
              name={`pdp-${product.id}`}
              isSubscribed={isSubscribed}
              interval={subInterval}
              onOneTime={() => {
                setIsSubscribed(false);
              }}
              onSubscribe={() => {
                setIsSubscribed(true);
              }}
              onIntervalChange={(val) => setSubInterval(val)}
            />

            {/* Preferred delivery days when subscribed */}
            {isSubscribed && <PreferDeliveryDaySelector />}

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
          <Button className="mt-6 w-full" onClick={handleAddToCart}>
            Add to Shopping Cart
          </Button>
        </div>
      </div>
      {/* Recently Viewed (only full page) */}
      {!isModal && (
        <div className="mt-20">
          <RecentlyViewedSection />
        </div>
      )}
    </div>
  );
}
