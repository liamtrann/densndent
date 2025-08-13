// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Modal } from "components";
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
} from "common";
import api from "api/api";
import endpoint from "api/endpoints";
import { delayCall } from "api/util";
import { addToCart } from "store/slices/cartSlice";
import { useRecentViews } from "../hooks/useRecentViews";
import {
  getMatrixInfo,
  formatCurrency,
  useQuantityHandlers,
  extractBuyGet,
} from "config/config";
import { addToRecentViews } from "../redux/slices/recentViewsSlice";
import RecentlyViewedSection from "../components/sections/RecentlyViewedSection";

// ✅ Reusable purchase control
import PurchaseOptions from "../common/ui/PurchaseOptions";

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

export default function ProductsPage() {
  const { id } = useParams();
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

  const { addProductToRecentViews } = useRecentViews();

  const {
    quantity,
    actualQuantity,
    handleQuantityChange,
    increment,
    decrement,
  } = useQuantityHandlers(1, product?.stockdescription);

  // fetch product
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(endpoint.GET_PRODUCT_BY_ID(id));
        setProduct(res.data);
        dispatch(addToRecentViews(res.data.id));
        // reset PDP subscription UI on product change
        setIsSubscribed(false);
        setSubInterval("1");
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, dispatch]);

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
    if (id) addProductToRecentViews(id);
  }, [id, addProductToRecentViews]);

  const handleAddToCart = () => {
    if (!product) return;
    const cartItem = {
      ...product,
      quantity: Number(actualQuantity),
      // ✅ carry PDP subscription choice into cart
      subscriptionEnabled: isSubscribed,
      subscriptionInterval: isSubscribed ? subInterval : null,
    };

    delayCall(() => {
      dispatch(addToCart(cartItem));
      Toast.success(`Added ${actualQuantity} ${product.itemid} to cart!`);
    });
  };

  const { matrixType, options: matrixOptionsList } = getMatrixInfo(matrixOptions);

  if (loading) return <Loading text="Loading product..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

  // compute first delivery date preview
  const firstDeliveryDate = isSubscribed
    ? nextSubscriptionDateFromToday(subInterval)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="overflow-hidden">
          <ProductImage
            src={product.file_url}
            className="w-full object-contain transition-transform duration-300 ease-in-out hover:scale-150 cursor-zoom-in"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {product.itemid}
          </h2>

          {product.totalquantityonhand && product.totalquantityonhand > 0 ? (
            <Paragraph className="text-green-700 font-semibold">
              Current Stock: {product.totalquantityonhand}
            </Paragraph>
          ) : (
            <Paragraph className="text-red-600 font-semibold">
              Out of stock
            </Paragraph>
          )}

          <div className="mt-2 mb-4">
            {product.price ? (
              <div className="text-3xl font-bold text-gray-800">
                {formatCurrency(product.price)}
              </div>
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
                  disabled={
                    !product.totalquantityonhand ||
                    product.totalquantityonhand <= 0 ||
                    Number(quantity) <= 1
                  }
                >
                  –
                </button>
                <InputField
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="flex-1 h-9 text-center text-sm border-0 focus:ring-1 focus:ring-blue-500"
                  disabled={
                    !product.totalquantityonhand ||
                    product.totalquantityonhand <= 0
                  }
                />
                <button
                  onClick={increment}
                  className="px-2 h-9 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={
                    !product.totalquantityonhand ||
                    product.totalquantityonhand <= 0
                  }
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
              onOneTime={() => setIsSubscribed(false)}
              onSubscribe={() => setIsSubscribed(true)}
              onIntervalChange={(val) => setSubInterval(val)}
            />

            {/* date preview when subscribed */}
            {isSubscribed && (
              <div className="mt-2 text-xs text-gray-600">
                <span className="font-medium">First delivery:</span>{" "}
                <span>{formatLocalDateToronto(firstDeliveryDate)}</span>
                <span className="ml-1">
                  ({subInterval === "1" ? "every 1 month" : `every ${subInterval} months`})
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <Button
            className={`mt-6 w-full ${
              !product.totalquantityonhand || product.totalquantityonhand <= 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                : ""
            }`}
            onClick={
              product.totalquantityonhand && product.totalquantityonhand > 0
                ? handleAddToCart
                : undefined
            }
            disabled={
              !product.totalquantityonhand || product.totalquantityonhand <= 0
            }
          >
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

      {/* ✅ Recently Viewed Products Carousel */}
      <div className="mt-20">
        <RecentlyViewedSection />
      </div>
    </div>
  );
}
