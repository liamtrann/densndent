// src/hooks/useProductDetail.js
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import api from "api/api";
import endpoint from "api/endpoints";
import { delayCall } from "api/util";

import {
  formatCurrency,
  DateUtils,
  DOW_LABELS,
  monIdxFromJsIdx,
  nextDateForWeekdayFrom, // exported from config
  resolveProductIdByNameOrId, // new util (see step 3 below)
} from "config/config";

import { useRecentViews } from "@/hooks/useRecentViews";
import { addToRecentViews } from "@/redux/slices/recentViewsSlice";

export default function useProductDetail({ productId: propProductId = null, isModal = false }) {
  const { id: rawId } = useParams();
  const effectiveRawId = propProductId || rawId;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addProductToRecentViews } = useRecentViews();

  // core data
  const [product, setProduct] = useState(null);
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

  const priceDisplay = useMemo(
    () => (product?.price ? formatCurrency(product.price) : null),
    [product?.price]
  );

  // fetch product (with resolving step)
  useEffect(() => {
    let abort = false;
    async function fetchProduct() {
      try {
        const pid = await resolveProductIdByNameOrId(effectiveRawId);
        if (!pid) throw new Error("Product not found");

        if (pid !== effectiveRawId && !isModal) {
          navigate(`/product/${pid}`, { replace: true });
        }

        const res = await api.get(endpoint.GET_PRODUCT_BY_ID(pid));
        if (abort) return;

        setProduct(res.data);

        // numeric id recent view
        if (!isModal) dispatch(addToRecentViews(res.data.id));
      } catch (err) {
        console.error(err);
        setProduct(null);
      }
    }

    fetchProduct();
    return () => {
      abort = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveRawId, isModal]);

  // also track the textual raw id as a "recent view"
  useEffect(() => {
    if (effectiveRawId) addProductToRecentViews(effectiveRawId);
  }, [effectiveRawId, addProductToRecentViews]);

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

  // keep variant dropdown in sync with loaded product
  useEffect(() => {
    if (product) setSelectedMatrixOption(product.id);
  }, [product]);

  // reset PDP subscription UI on product change
  useEffect(() => {
    if (!product) return;
    setIsSubscribed(false);
    setSubInterval("1");
    setSubStatus("active");
    const initial = DateUtils.nextSubscriptionDateFromToday("1");
    setSubDate(DateUtils.toInput(initial));
    setDateTouched(false);
    setPreferredDow(monIdxFromJsIdx(initial.getDay()));
  }, [product]);

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

  return {
    // product + variants
    product,
    matrixOptions,
    selectedMatrixOption,
    setSelectedMatrixOption,

    // PDP subscription state
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

    // helpers
    priceDisplay,

    // expose labels and helpers used in UI
    DOW_LABELS,
    DateUtils,
    nextDateForWeekdayFrom,
  };
}
