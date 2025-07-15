import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, InputField, Paragraph, ProductImage } from "../../common";

export default function CheckoutSummary({ promoCode, setPromoCode }) {
  const cart = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  const subtotal = cart
    .reduce(
      (sum, item) => sum + (item.unitprice || item.price || 0) * item.quantity,
      0
    )
    .toFixed(2);

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
        <span className="font-semibold">${subtotal}</span>
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
        <span>${subtotal}</span>
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
            <div
              key={item.id + "-" + idx}
              className="p-3 border rounded flex items-start gap-3"
            >
              <ProductImage
                src={item.file_url || item.img1 || item.imageurl}
                alt={item.itemid || item.displayname}
                className="w-16 h-16 object-contain border rounded"
              />
              <div className="space-y-1">
                {/* 🔗 Clickable title */}
                <div
                  onClick={() => handleNavigateToProduct(item.id)}
                  className="font-semibold text-blue-700 hover:underline cursor-pointer"
                >
                  {item.itemid || item.displayname}
                </div>

                <div>Unit price: ${item.unitprice || item.price}</div>
                <div>Quantity: {item.quantity}</div>
                <div className="font-bold">
                  Amount: $
                  {((item.unitprice || item.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            </div>
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
