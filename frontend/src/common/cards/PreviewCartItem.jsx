import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductImage } from "common";
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

  return (
    <div
      className={`flex items-start gap-3 ${compact ? "pb-2" : "p-3"} border-b`}
    >
      <ProductImage
        src={item.file_url || item.img1 || item.imageurl}
        alt={item.itemid || item.displayname}
        className={`${imageSize} object-cover ${
          compact ? "" : "border rounded"
        } ${onItemClick ? "cursor-pointer" : ""}`}
        onClick={onItemClick ? () => onItemClick(item.id) : undefined}
      />
      <div className={`flex-1 ${textSize}`}>
        <div
          className={`font-medium line-clamp-2 ${
            onItemClick ? "text-blue-700 hover:underline cursor-pointer" : ""
          }`}
          onClick={onItemClick ? () => onItemClick(item.id) : undefined}
        >
          {item.itemid || item.displayname}
        </div>

        {item.stockdescription && (
          <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded inline-block mt-1 mb-1">
            {item.stockdescription}
          </span>
        )}

        {!compact && (
          <div className="text-gray-600 mt-1">
            Unit price: ${Number(item.unitprice || item.price || 0).toFixed(2)}
          </div>
        )}

        {showQuantityControls && onQuantityChange ? (
          <div className="flex items-center gap-2 mt-1">
            <span>Quantity</span>
            <button
              onClick={handleDecrease}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={handleIncrease}
              className="px-2 py-1 border rounded hover:bg-gray-100"
            >
              +
            </button>
          </div>
        ) : (
          <div className="mt-1">Quantity: {item.quantity}</div>
        )}

        {showTotal && (
          <div className="mt-1">
            {hasDiscount ? (
              <div>
                <div className="text-gray-500 line-through text-xs">
                  {calculateTotalCurrency(unitPrice, item.quantity)}
                </div>
                <div className="text-red-600 font-semibold">
                  {formatCurrency(finalPrice)}
                </div>
                <div className="text-green-600 text-xs">
                  Save {formatCurrency(priceData?.discount || 0)}
                </div>
              </div>
            ) : (
              <div className="text-gray-800 font-semibold">
                {formatCurrency(finalPrice)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
