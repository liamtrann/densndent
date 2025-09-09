import { useState, useEffect } from "react";

import api from "../api/api.js";

import { SHIPPING_METHOD } from "@/constants/constant.js";

/* =======================
   Order/Number utils (NEW)
   ======================= */

// first non-null/undefined/empty value
export const pick = (...vals) =>
  vals.find((v) => v !== undefined && v !== null && v !== "");

// robust numeric parse (handles strings like "$1,234.50")
export function toNum(v) {
  if (v === undefined || v === null) return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const n = parseFloat(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export const round2 = (n) =>
  Math.round((toNum(n) + Number.EPSILON) * 100) / 100;

/**
 * Normalize a SuiteQL/REST order line into a predictable, positive-display shape.
 * Ensures qty, rate, amount are ABS() so no leading "-" in the UI.
 */
export function normalizeOrderLine(row) {
  const rawQty = toNum(
    pick(row.total_quantity, row.quantity, row.qty, row.custcol_quantity, 0)
  );
  const quantity = Math.abs(rawQty);

  const rawRate = toNum(
    pick(row.rate, row.unitprice, row.price, row.rateamount, 0)
  );
  const rate = Math.abs(rawRate);

  const rawAmount = toNum(
    pick(row.netamount, row.rateamount, row.amount, quantity * rate)
  );
  const amount = Math.abs(rawAmount);

  return {
    lineId:
      pick(row.line, row.linenumber, row.lineId, row.seq) ?? Math.random(),
    productId: pick(row.item, row.itemId, row.item_id, row.internalid, row.id), // <-- add this
    sku: pick(row.itemid, row.itemId, row.item_id, row.sku, ""),
    name: pick(
      row.itemname,
      row.item_displayname,
      row.displayname,
      row.itemid,
      row.name,
      "Item"
    ),
    quantity,
    rate,
    amount,
    image: pick(row.file_url, row.image, row.thumbnail, row.fileurl, ""),
  };
}

/** Sum line amounts (robust: prefers amount, falls back to qty*rate; always positive) */
export function computeLinesSubtotal(lines = []) {
  const sum = lines.reduce((acc, l) => {
    const qty = Math.abs(toNum(l?.quantity));
    const rate = Math.abs(toNum(l?.rate));
    const amount = toNum(l?.amount);
    const lineTotal = Math.abs(amount > 0 ? amount : round2(qty * rate));
    return acc + lineTotal;
  }, 0);
  return round2(sum);
}

/**
 * Prefer header total (may include tax/shipping/fees) with sensible fallbacks.
 * Tries: totalAfterDiscount → foreigntotal → total → grandtotal; uses ABS() and
 * falls back to the (positive) subtotal when header isn't a valid positive number.
 */
export function computeOrderTotalFromSummary(
  summary = {},
  fallbackSubtotal = 0
) {
  const headerRaw = pick(
    summary?.totalAfterDiscount,
    summary?.foreigntotal,
    summary?.total,
    summary?.grandtotal
  );
  const header = Math.abs(toNum(headerRaw));
  const subtotal = Math.abs(toNum(fallbackSubtotal));
  const total = header > 0 ? header : subtotal;
  return round2(total);
}

/* =======================
   Existing utilities
   ======================= */

function extractBuyGet(str) {
  const numbers = str.match(/\d+/g);
  return {
    buy: numbers ? parseInt(numbers[0], 10) : null,
    get: numbers ? parseInt(numbers[1], 10) : null,
  };
}

// Parse custitem38 to get matrix type and options
function getMatrixInfo(matrixOptions) {
  if (matrixOptions.length === 0) return { matrixType: "", options: [] };

  try {
    // Get the first item to determine the matrix type
    const firstItem = matrixOptions[0];
    if (firstItem.custitem38) {
      // Parse as JavaScript object string (not JSON)
      const objectString = firstItem.custitem38.replace(/'/g, '"'); // Replace single quotes with double quotes
      const parsed = JSON.parse(objectString);
      const matrixType = Object.keys(parsed)[0]; // e.g., "Shade"

      const options = matrixOptions.map((item) => {
        try {
          const itemObjectString = item.custitem38.replace(/'/g, '"');
          const itemParsed = JSON.parse(itemObjectString);
          const value = itemParsed[matrixType]; // e.g., "Shade A2"
          return {
            value: item.id,
            label: value || item.itemid,
          };
        } catch {
          return {
            value: item.id,
            label: item.itemid,
          };
        }
      });

      return { matrixType, options };
    }
  } catch {
    // Fallback if parsing fails
  }

  return {
    matrixType: "Options",
    options: matrixOptions.map((item) => ({
      value: item.id,
      label: item.custitem38 || item.itemid,
    })),
  };
}

// Format price with proper rounding to 2 decimal places
function formatPrice(price) {
  // Handle null, undefined, or invalid values
  if (price === null || price === undefined || isNaN(price)) {
    return "0.00";
  }

  // Convert to number and format to 2 decimal places
  return Number(price).toFixed(2);
}

// Format price with currency symbol
function formatCurrency(price, currency = "$") {
  return `${currency}${formatPrice(price)}`;
}

// Calculate total price for quantity
function calculateTotalPrice(unitPrice, quantity) {
  if (!unitPrice || !quantity) return "0.00";

  const total = Number(unitPrice) * Number(quantity);
  return formatPrice(total);
}

// Calculate total price with currency symbol
function calculateTotalCurrency(unitPrice, quantity, currency = "$") {
  return `${currency}${calculateTotalPrice(unitPrice, quantity)}`;
}

// Calculate order total with shipping and tax
function calculateOrderTotal(
  subtotal,
  shippingCost = null,
  estimatedTax = null
) {
  // Free shipping for orders $300 and above
  const shipping =
    subtotal >= 300 ? 0 : shippingCost !== null ? shippingCost : 9.99;
  const tax = estimatedTax || 0;
  const total = Number(subtotal) + Number(tax) + Number(shipping);

  return {
    shipping,
    tax,
    total,
  };
}

// Calculate total price after discount based on promotions
async function getTotalPriceAfterDiscount(productId, unitPrice, quantity) {
  try {
    // Import api and endpoints here to avoid circular dependency
    const { default: api } = await import("../api/api.js");
    const { default: endpoint } = await import("../api/endpoints.js");

    // Fetch promotions for the product
    const promotionUrl = endpoint.GET_PROMOTIONS_BY_PRODUCT({
      productId,
    });

    const response = await api.get(promotionUrl);
    const promotions = response.data;

    if (!promotions || promotions.length === 0) {
      return {
        originalPrice: Number(unitPrice) * Number(quantity),
        discountedPrice: Number(unitPrice) * Number(quantity),
        discount: 0,
        promotionApplied: null,
      };
    }

    const originalTotal = Number(unitPrice) * Number(quantity);
    let bestDiscount = 0;
    let bestPromotion = null;

    // Check each promotion to find the best discount
    for (const promotion of promotions) {
      const { fixedprice, itemquantifier } = promotion;

      // Skip if promotion doesn't have required fields
      if (!fixedprice || !itemquantifier) continue;

      // Check if quantity meets the minimum requirement
      if (Number(quantity) >= Number(itemquantifier)) {
        // Calculate how many promotion sets can be applied
        const promotionSets = Math.floor(
          Number(quantity) / Number(itemquantifier)
        );
        const remainingItems = Number(quantity) % Number(itemquantifier);

        // Calculate discounted price
        const discountedTotal =
          promotionSets * Number(fixedprice) +
          remainingItems * Number(unitPrice);
        const discount = originalTotal - discountedTotal;

        // Keep track of best discount
        if (discount > bestDiscount) {
          bestDiscount = discount;
          bestPromotion = promotion;
        }
      }
    }

    return {
      originalPrice: originalTotal,
      discountedPrice: originalTotal - bestDiscount,
      discount: bestDiscount,
      promotionApplied: bestPromotion,
    };
  } catch (error) {
    // Return original price if error occurs
    const originalTotal = Number(unitPrice) * Number(quantity);
    return {
      originalPrice: originalTotal,
      discountedPrice: originalTotal,
      discount: 0,
      promotionApplied: null,
      error: error.message,
    };
  }
}

// Postal code lookup function (simplified - now uses separate validation)
async function fetchLocationByPostalCode(country, code) {
  if (!code || !code.trim()) {
    return {
      success: false,
      error: "Postal code is required",
    };
  }

  // Use the new validation function
  const validationError = validatePostalCode(code, country);
  if (validationError) {
    return {
      success: false,
      error: validationError,
    };
  }

  try {
    const cleanCode = code.replace(/\s/g, "").toUpperCase();
    let apiUrl = "";

    if (country === "us") {
      apiUrl = `https://api.zippopotam.us/us/${cleanCode}`;
    } else if (country === "ca") {
      const firstThree = cleanCode.slice(0, 3);
      apiUrl = `https://api.zippopotam.us/ca/${firstThree}`;
    } else {
      return {
        success: false,
        error: 'Country not supported. Only "us" and "ca" are supported.',
      };
    }

    const response = await fetch(apiUrl);

    if (!response.ok) {
      return {
        success: false,
        error: `Postal code not found (${response.status})`,
      };
    }

    const data = await response.json();

    if (data.places && data.places.length > 0) {
      return {
        success: true,
        data: {
          city: data.places[0]["place name"],
          province: data.places[0]["state abbreviation"],
          state: data.places[0]["state abbreviation"], // Alias for province
          country: data.country,
          latitude: data.places[0]["latitude"],
          longitude: data.places[0]["longitude"],
        },
      };
    } else {
      return {
        success: false,
        error: "No location data found",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to fetch location data",
    };
  }
}

// Quantity handling utilities for Buy X Get Y promotions
function calculateActualQuantity(selectedQuantity, stockdescription) {
  const { buy, get } = extractBuyGet(stockdescription || "");

  if (!buy || !get) {
    return selectedQuantity;
  }

  // Calculate how many complete "buy" sets the user has selected
  const buyMultiplier = Math.floor(selectedQuantity / buy);
  const remainder = selectedQuantity % buy;

  // Calculate total quantity: (buy + get) * multiplier + remainder
  return buyMultiplier * (buy + get) + remainder;
}

// Create quantity handler functions
function createQuantityHandlers(
  quantity,
  setQuantity,
  setActualQuantity,
  stockdescription
) {
  const updateQuantities = (newQuantity) => {
    setQuantity(newQuantity);
    setActualQuantity(calculateActualQuantity(newQuantity, stockdescription));
  };

  return {
    handleQuantityChange: (e) => {
      const value = e.target.value;
      if (Number(value) < 1) {
        updateQuantities(1);
      } else {
        updateQuantities(Number(value));
      }
    },

    increment: () => {
      const newQuantity = Number(quantity) + 1;
      updateQuantities(newQuantity);
    },

    decrement: () => {
      if (Number(quantity) > 1) {
        const newQuantity = Number(quantity) - 1;
        updateQuantities(newQuantity);
      }
    },
  };
}

// Hook-like utility for quantity management with Buy X Get Y logic
function useQuantityHandlers(initialQuantity = 1, stockdescription = "") {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [actualQuantity, setActualQuantity] = useState(
    calculateActualQuantity(initialQuantity, stockdescription)
  );

  const handlers = createQuantityHandlers(
    quantity,
    setQuantity,
    setActualQuantity,
    stockdescription
  );

  // Update actual quantity when stockdescription changes
  useEffect(() => {
    setActualQuantity(calculateActualQuantity(quantity, stockdescription));
  }, [quantity, stockdescription]);

  return {
    quantity,
    actualQuantity,
    setQuantity: (newQuantity) => {
      setQuantity(newQuantity);
      setActualQuantity(calculateActualQuantity(newQuantity, stockdescription));
    },
    setActualQuantity,
    ...handlers,
  };
}

async function fetchRegionByCode(country, code) {
  try {
    // Only allow 'ca' or 'us'
    if (country !== "ca" && country !== "us") {
      throw new Error('Country not supported. Only "ca" and "us" are allowed.');
    }
    let cleanCode = code.replace(/\s/g, "").toUpperCase();
    if (country === "ca") {
      cleanCode = cleanCode.slice(0, 3); // Use only first 3 characters for Canada
    }
    const response = await api.get(
      `https://api.zippopotam.us/${country}/${cleanCode}`
    );
    return response.data;
  } catch (error) {
    return null;
  }
}

// Phone validation function
function validatePhone(phone) {
  // Allow empty/null phone numbers (optional field)
  if (!phone || phone.trim() === "") {
    return true;
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");

  // Check if it's exactly 10 digits (US/Canada format)
  return digitsOnly.length === 10;
}

// Password validation function
function validatePassword(password) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
    password
  );
}

// Postal code validation functions
function validateCanadianPostalCode(code) {
  // Canadian postal code format: A1A 1A1 (letter-digit-letter space digit-letter-digit)
  const canadianPattern = /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/;
  return canadianPattern.test(code);
}

function validateUSZipCode(code) {
  // US zip code format: 12345 or 12345-6789
  const usPattern = /^\d{5}(-\d{4})?$/;
  return usPattern.test(code);
}

function validatePostalCode(code, selectedCountry) {
  if (!code.trim()) {
    return "Postal/Zip code is required";
  }

  if (selectedCountry === "ca") {
    return validateCanadianPostalCode(code)
      ? ""
      : "Please enter a valid Canadian postal code (e.g., A1A 1A1)";
  } else if (selectedCountry === "us") {
    return validateUSZipCode(code)
      ? ""
      : "Please enter a valid US zip code (e.g., 12345 or 12345-6789)";
  }

  return "";
}

// Reusable estimate tax and shipping function
async function handleTaxShippingEstimate({
  country,
  postalCode,
  subtotal,
  onSuccess,
  onError,
  onLoading,
  onDismiss,
}) {
  // Import modules dynamically to avoid circular dependencies
  const { default: endpoint } = await import("../api/endpoints.js");

  try {
    // Normalize country values to lowercase codes
    let normalizedCountry = country?.toLowerCase()?.trim();

    // Map all possible country variations to standardized codes
    const countryMap = {
      ca: "ca",
      canada: "ca",
      can: "ca",
      us: "us",
      usa: "us",
      america: "us",
    };

    normalizedCountry = countryMap[normalizedCountry];

    // Ensure we only accept valid normalized countries
    if (normalizedCountry !== "ca" && normalizedCountry !== "us") {
      const errorMessage =
        "Country not supported. Only Canada (ca) and United States (us) are supported.";
      if (onError) onError(errorMessage);
      return { success: false, error: errorMessage };
    }

    // Validate postal code before making API call
    const validationError = validatePostalCode(postalCode, normalizedCountry);
    if (validationError) {
      if (onError) onError(validationError);
      return { success: false, error: validationError };
    }

    if (onLoading) onLoading("Estimating region...");

    const result = await fetchRegionByCode(normalizedCountry, postalCode);

    if (onDismiss) onDismiss();

    if (result) {
      const province =
        result.places[0]?.state || result.places[0]?.state_abbreviation;

      if (province) {
        try {
          // Get tax rates
          const taxUrl = endpoint.GET_TAX_RATES({
            country: normalizedCountry,
            province,
          });
          const taxRates = await api.get(taxUrl);

          // Get shipping cost first
          const shippingRes = await api.get(
            endpoint.GET_SHIPPING_METHOD(Number(SHIPPING_METHOD))
          );
          const shippingCost = shippingRes.data?.shippingflatrateamount ?? 9.99;

          // Calculate final shipping cost (free shipping for orders $300+)
          const finalShippingCost = Number(subtotal) >= 300 ? 0 : shippingCost;

          // Calculate estimated tax on subtotal + shipping
          const totalTaxRate = taxRates.data?.rates?.total;
          let estimatedTax = null;

          if (totalTaxRate && subtotal) {
            const taxableAmount = Number(subtotal) + finalShippingCost;
            estimatedTax = taxableAmount * Number(totalTaxRate);
          }

          const estimateData = {
            estimatedTax,
            shippingCost,
            taxRate: totalTaxRate,
            province,
            country: normalizedCountry,
          };

          if (onSuccess) onSuccess("Tax rates loaded!", estimateData);

          return {
            success: true,
            data: estimateData,
          };
        } catch (taxError) {
          const errorMessage = "Failed to get tax rates or shipping cost.";
          if (onError) onError(errorMessage);
          return { success: false, error: errorMessage };
        }
      } else {
        const errorMessage = "Province not found in region lookup.";
        if (onError) onError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } else {
      const errorMessage = "Region lookup failed.";
      if (onError) onError(errorMessage);
      return { success: false, error: errorMessage };
    }
  } catch (err) {
    if (onDismiss) onDismiss();
    const errorMessage = err.message || "Region lookup failed.";
    if (onError) onError(errorMessage);
    return { success: false, error: errorMessage };
  }
}

// Build idempotency key for order deduplication
function buildIdempotencyKey(
  userInfo,
  cartItems,
  shipMethodId = SHIPPING_METHOD,
  windowMins = 10
) {
  const cartKey = (cartItems || [])
    .map((i) => `${i.netsuiteId || i.id}x${i.quantity}`)
    .sort()
    .join("|");
  const windowBucket = Math.floor(Date.now() / (windowMins * 60 * 1000));
  const raw = `${
    userInfo?.id || "anon"
  }|${shipMethodId}|${cartKey}|${windowBucket}`;

  // Simple base64 makes it compact and header-safe
  try {
    return `ck-${btoa(unescape(encodeURIComponent(raw))).slice(0, 64)}`;
  } catch {
    return `ck-${Date.now()}`;
  }
}

// Generate a secure random password for NetSuite user creation
function generateRandomPassword(length = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Calculate next run date for custrecord_ro_next_run field
function calculateNextRunDate(interval, intervalUnit) {
  const currentDate = new Date();
  const parsedInterval = parseInt(interval) || 1;
  const normalizedUnit = (intervalUnit || "week").toLowerCase();

  const nextRunDate = new Date(currentDate);

  switch (normalizedUnit) {
    case "week":
      nextRunDate.setDate(currentDate.getDate() + parsedInterval * 7);
      break;
    case "month":
      nextRunDate.setMonth(currentDate.getMonth() + parsedInterval);
      break;

    default:
      nextRunDate.setMonth(currentDate.getMonth() + parsedInterval);
  }

  return nextRunDate.toISOString().slice(0, 10); // yyyy-mm-dd format
}

/* =======================
   Subscription UI helpers
   ======================= */

// Options for the interval <Dropdown>
export const SUBSCRIPTION_INTERVAL_OPTIONS = [
  { value: "1", label: "Every 1 month" },
  { value: "2", label: "Every 2 months" },
  { value: "3", label: "Every 3 months" },
  { value: "6", label: "Every 6 months" },
];

// Small date helpers we reuse across subscription UI
export function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function addMonthsSafe(date, months) {
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

export function formatLocalDateToronto(date) {
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "America/Toronto",
  });
}

export function nextFromToday(intervalStr) {
  const n = parseInt(intervalStr || "1", 10);
  return addMonthsSafe(new Date(), Number.isFinite(n) ? n : 1);
}

/**
 * Normalize a backend recurring-order record into a single, predictable shape.
 * Works with minor field-name differences coming from SuiteQL/REST.
 */
/**
 * Normalize a backend recurring-order record into a single, predictable shape.
 * Works with minor field-name differences coming from SuiteQL/REST.
 */
// config.js
// config.js
export function normalizeSubscriptionRecord(r) {
  const roId = r.id ?? r.internalid ?? r.roId;

  // Try every common place NetSuite may put the item
  const raw =
    r.item ??
    r.custrecord_ro_item ??
    r.custrecord_item ??
    r.iteminternalid ??
    r.item_internalid ??
    r.itemId ??
    r.item_id ??
    r.internalid_item ??
    r.item_internal_id ??
    r.productId ??
    null;

  // Extract a numeric internalid from any shape
  const pickNumericId = (v) => {
    if (v == null) return undefined;

    if (Array.isArray(v)) {
      for (const el of v) {
        const got = pickNumericId(el);
        if (got) return got;
      }
      return undefined;
    }

    if (typeof v === "object") {
      const candidate =
        v.id ??
        v.internalid ??
        v.internalId ??
        v.value ??
        v.itemid ??
        v.itemId ??
        v.item_id ??
        v.item;
      return pickNumericId(candidate);
    }

    const s = String(v).trim();
    if (!s || s === "[object Object]") return undefined;

    // JSON payload like {"id":"20412"} or [{"id":20412}]
    if (
      (s.startsWith("{") && s.endsWith("}")) ||
      (s.startsWith("[") && s.endsWith("]"))
    ) {
      try {
        const parsed = JSON.parse(s);
        return pickNumericId(parsed);
      } catch {
        /* ignore */
      }
    }

    // Accept things like "20412", "id=20412", "internalid:20412"
    const m = s.match(/(\d{3,})/);
    return m ? m[1] : undefined;
  };

  const productId = pickNumericId(raw); // numeric string if we found one

  return {
    roId,
    productId,
    itemid:
      r.itemid ||
      r.itemName ||
      r.name ||
      r.displayname ||
      `#${productId || roId}`,
    displayname:
      r.displayname ||
      r.itemName ||
      r.name ||
      r.itemid ||
      `#${productId || roId}`,
    file_url: r.file_url || r.image || r.thumbnail || r.fileUrl || "",
    interval: String(
      r.interval || r.custrecord_ro_interval || r.recurringInterval || "1"
    ),
  };
}

/** Detect if a recurring order is canceled (status "3") regardless of field shape */
export function isSubscriptionCanceled(rec) {
  const val =
    rec?.custrecord_ro_status?.id ??
    rec?.custrecord_ro_status ??
    rec?.statusId ??
    rec?.status;
  return String(val) === "3";
}

/** Small payload helpers so we don’t repeat magic values in components */
export function buildIntervalPatchPayload(interval) {
  return { custrecord_ro_interval: Number(interval) };
}

/* ──────────────────────────────────────────────────────────────────────────
   Scheduling utilities (shared by PDP + Subscriptions)
   ────────────────────────────────────────────────────────────────────────── */
export const DateUtils = {
  // Keep helpers as properties to avoid top-level duplicate identifiers
  daysInMonth: (y, m) => new Date(y, m + 1, 0).getDate(),

  addMonthsSafe(date, months) {
    const day = date.getDate();
    const targetMonth = date.getMonth() + months;
    const targetYear = date.getFullYear() + Math.floor(targetMonth / 12);
    const normalizedMonth = ((targetMonth % 12) + 12) % 12;
    const endDay = this.daysInMonth(targetYear, normalizedMonth);
    const d = new Date(date);
    d.setFullYear(targetYear, normalizedMonth, Math.min(day, endDay));
    return d;
  },

  toInput(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  },

  fmtToronto(date) {
    return date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "America/Toronto",
    });
  },

  nextSubscriptionDateFromToday(intervalStr) {
    const n = parseInt(intervalStr || "1", 10);
    return this.addMonthsSafe(new Date(), isNaN(n) ? 1 : n);
  },
};

/*export const DOW_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // Mon index 0..6
export const jsIdxFromMonIdx = (monIdx) => (monIdx + 1) % 7; // Mon0..Sun6 -> JS Sun0..Sat6
export const monIdxFromJsIdx = (jsIdx) => (jsIdx + 6) % 7; // JS Sun0..Sat6 -> Mon0..Sun6*/

// Convert day numbers (1-7) to readable text
/*export const formatDeliveryDays = (dayNumbers) => {
  if (!dayNumbers || dayNumbers.length === 0) return "No preferences set";

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    dayNumbers
      .map((dayNum) => dayLabels[dayNum - 1]) // Convert 1-based to 0-based
      .filter(Boolean) // Remove undefined values
      .join(", ") || "No preferences set"
  );
};*/

/*export const nextDateForWeekdayFrom = (baseDate, monIdx) => {
  const jsTarget = jsIdxFromMonIdx(monIdx);
  const start = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate()
  );
  const diff = (jsTarget - start.getDay() + 7) % 7;
  const result = new Date(start);
  result.setDate(start.getDate() + diff);
  return result;
};*/

// config/config.js

// …existing imports and exports…

/** Resolve any non-numeric id to a numeric internal id via your search endpoint. */
export async function resolveProductIdByNameOrId(maybeId) {
  const s = String(maybeId || "").trim();
  if (/^\d+$/.test(s)) return s;

  const { default: endpoint } = await import("../api/endpoints.js");
  const { default: api } = await import("../api/api.js");

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
      /* continue */
    }
  }
  return null;
}







// ─────────────────────────────────────────────────────────────
// Preferred Delivery Days — single source of truth
// ─────────────────────────────────────────────────────────────
export const DOW_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Convert Mon-index (1..7) <-> JS getDay() (0..6)
export const jsIdxFromMonIdx = (monIdx) => (monIdx + 1) % 7; // Mon1..Sun7 -> JS Sun0..Sat6
export const monIdxFromJsIdx = (jsIdx) => (jsIdx + 6) % 7;   // JS Sun0..Sat6 -> Mon1..Sun7

// Display helper: [1,2,5] -> "Mon, Tue, Fri"
export function formatDeliveryDays(dayNumbers) {
  const nums = Array.isArray(dayNumbers) ? dayNumbers : [];
  const cleaned = Array.from(
    new Set(nums.map(Number).filter((n) => Number.isFinite(n) && n >= 1 && n <= 7))
  ).sort((a, b) => a - b);
  if (cleaned.length === 0) return "No preferences set";
  return cleaned.map((n) => DOW_LABELS[n - 1]).join(", ");
}

// Parse "1, 2, 3" (or "1,2,3"/["1","2","3"]) -> [1,2,3]
export function parsePreferredDays(value) {
  if (!value) return [];
  const parts = Array.isArray(value)
    ? value
    : typeof value === "string"
    ? value.split(/[,\s]+/)
    : [value];
  return Array.from(
    new Set(parts.map((s) => parseInt(s, 10)).filter((n) => Number.isFinite(n) && n >= 1 && n <= 7))
  ).sort((a, b) => a - b);
}

// Serialize [1,2,3] -> "1, 2, 3"
export function serializePreferredDays(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "";
  const cleaned = Array.from(
    new Set(arr.map((n) => parseInt(n, 10)).filter((n) => Number.isFinite(n) && n >= 1 && n <= 7))
  ).sort((a, b) => a - b);
  return cleaned.join(", ");
}

// Next date (Date) for a given weekday (Mon-index 1..7) from base date
export const nextDateForWeekdayFrom = (baseDate, monIdx) => {
  const jsTarget = jsIdxFromMonIdx(monIdx);
  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const diff = (jsTarget - start.getDay() + 7) % 7;
  const result = new Date(start);
  result.setDate(start.getDate() + diff);
  return result;
};


export {
  extractBuyGet,
  getMatrixInfo,
  formatPrice,
  formatCurrency,
  calculateTotalPrice,
  calculateTotalCurrency,
  calculateOrderTotal,
  getTotalPriceAfterDiscount,
  fetchLocationByPostalCode,
  calculateActualQuantity,
  createQuantityHandlers,
  useQuantityHandlers,
  fetchRegionByCode,
  validatePhone,
  validatePassword,
  validateCanadianPostalCode,
  validateUSZipCode,
  validatePostalCode,
  handleTaxShippingEstimate,
  buildIdempotencyKey,
  calculateNextRunDate,
  generateRandomPassword,
};
