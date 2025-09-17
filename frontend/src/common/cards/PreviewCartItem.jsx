import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CartLayout, TableLayout } from "common";
import { calculateTotalCurrency, formatCurrency } from "config/config";

import {
  calculatePriceAfterDiscount,
  selectPriceDataByKey,
  selectHasDiscount,
  selectFinalPrice,
  selectPriceDataExists,
} from "@/redux/slices";

export default function PreviewCartItem({
  item,
  onQuantityChange,
  onItemClick,
  showQuantityControls = true,
  showTotal = true,
  imageSize = "w-12 h-12",
  textSize = "text-sm",
  compact = false,
  listType = "card",
  inventoryStatus = null,
}) {
  const dispatch = useDispatch();
  const unitPrice = item.unitprice || item.price;

  // Get price data from Redux store
  const priceData = useSelector((state) =>
    selectPriceDataByKey(state, item.id, unitPrice, item.quantity)
  );
  const hasDiscount = useSelector((state) =>
    selectHasDiscount(state, item.id, unitPrice, item.quantity)
  );
  const finalPrice = useSelector((state) =>
    selectFinalPrice(state, item.id, unitPrice, item.quantity)
  );
  const priceDataExists = useSelector((state) =>
    selectPriceDataExists(state, item.id, unitPrice, item.quantity)
  );

  // Only calculate discount if data doesn't exist
  useEffect(() => {
    if (item.id && unitPrice && item.quantity && !priceDataExists) {
      dispatch(
        calculatePriceAfterDiscount({
          productId: item.id,
          unitPrice: unitPrice,
          quantity: item.quantity,
        })
      );
    }
  }, [dispatch, item.id, unitPrice, item.quantity, priceDataExists]);

  const handleDecrease = () => {
    if (onQuantityChange) {
      onQuantityChange(item, "dec");
    }
  };

  const handleIncrease = () => {
    if (onQuantityChange) {
      onQuantityChange(item, "inc");
    }
  };

  const commonProps = {
    item,
    showQuantityControls,
    showTotal,
    onItemClick,
    onQuantityChange,
    handleDecrease,
    handleIncrease,
    hasDiscount,
    finalPrice,
    priceData,
    unitPrice,
    calculateTotalCurrency,
    formatCurrency,
    inventoryStatus,
  };

  return listType === "table" ? (
    <TableLayout {...commonProps} />
  ) : (
    <CartLayout
      {...commonProps}
      imageSize={imageSize}
      textSize={textSize}
      compact={compact}
    />
  );
}
