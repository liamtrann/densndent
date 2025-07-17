import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, InputField, Paragraph } from "common";
import { formatCurrency } from "config/config";
import PreviewCartItem from "../cart/PreviewCartItem";

export default function CheckoutSummary({ promoCode, setPromoCode }) {
  const cart = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  const subtotal = formatCurrency(
    cart.reduce(
      (sum, item) => sum + (item.unitprice || item.price || 0) * item.quantity,
      0
    )
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
        <span className="font-semibold">{subtotal}</span>
      </div>

      <Paragraph className="text-xs text-gray-500 mb-2">
        Subtotal Does Not Include Shipping Or Tax
      </Paragraph>

      <div className="mb-2 flex justify-between text-sm">
        <span>Shipping</span>
        <span>$0.00</span>
      </div>

      <div className="mb-4 flex justify-between font-semibold">
        <span>TOTAL</span>
        <span>{subtotal}</span>
      </div>

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
