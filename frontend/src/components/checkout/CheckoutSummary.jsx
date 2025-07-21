import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, InputField, Paragraph, PreviewCartItem } from "common";
import { formatCurrency } from "config/config";
import {
  calculatePriceAfterDiscount,
  selectFinalPrice,
  selectCartSubtotalWithDiscounts,
} from "@/redux/slices";
import { EstimateTotal } from "components";

export default function CheckoutSummary({
  promoCode,
  setPromoCode,
  shippingCost = 0,
  estimatedTax = null,
  taxRate = null,
}) {
  const cart = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Calculate subtotal with discounted prices
  const subtotal = useSelector((state) =>
    selectCartSubtotalWithDiscounts(state, cart)
  );

  const handleNavigateToProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="border p-6 rounded shadow-md bg-white">
      <h3 className="text-lg font-semibold mb-4">Summary</h3>

      <div className="mb-2 flex justify-between text-sm">
        <span>
          SUBTOTAL {cart.length} ITEM{cart.length !== 1 ? "S" : ""}
        </span>
        <span className="font-semibold">{formatCurrency(subtotal)}</span>
      </div>

      <Paragraph className="text-xs text-gray-500 mb-2">
        Subtotal Does Not Include Shipping Or Tax
      </Paragraph>

      <EstimateTotal
        subtotal={subtotal}
        shippingCost={shippingCost}
        estimatedTax={estimatedTax}
        taxRate={taxRate}
        currency="$"
        showBreakdown={true}
        className="mb-4"
      />

      {/* Promo Code */}
      {/* <div className="mb-4">
        <h4 className="text-sm font-medium mb-1">Have a Promo Code?</h4>
        <div className="flex gap-2">
          <InputField
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter code"
          />
          <Button onClick={() => {}}>Apply</Button>
        </div>
      </div> */}

      {/* Cart Items */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">
          Items to Ship ({cart.length})
        </h4>
        <div className="space-y-3 text-sm">
          {cart.map((item, idx) => (
            <PreviewCartItem
              key={item.id + "-" + idx}
              item={item}
              onQuantityChange={null}
              onItemClick={handleNavigateToProduct}
              showQuantityControls={false}
              compact={false}
              imageSize="w-16 h-16"
              textSize="text-sm"
            />
          ))}
        </div>

        <Button
          className="text-blue-600 text-xs underline mt-2"
          variant="link"
          onClick={() => navigate("/cart")}
        >
          Edit Cart
        </Button>
      </div>
    </div>
  );
}
