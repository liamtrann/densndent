import React from "react";
import { useSelector } from "react-redux";
import InputField from "../common/InputField";
import Image from "../common/Image";

export default function CartPage() {
  const cart = useSelector((state) => state.cart.items);
  const [postalCode, setPostalCode] = React.useState("");
  const [promoCode, setPromoCode] = React.useState("");

  // Calculate subtotal and total quantity
  const subtotal = cart.reduce((sum, item) => sum + (item.unitprice || item.price || 0) * item.quantity, 0).toFixed(2);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
console.log(cart)
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        SHOPPING CART ({cart.length} Product{cart.length !== 1 ? "s" : ""}, {totalQuantity} Item{totalQuantity !== 1 ? "s" : ""})
      </h1>

      {/* Cart Items */}
      {cart.length > 0 ? (
        cart.map((item) => (
          <div key={item.id + (item.flavor ? `-${item.flavor}` : "")}
            className="flex gap-6 border p-4 rounded-md shadow-sm mb-4">
            <Image src={item.file_url} alt={item.itemid || item.displayname || "Product"} className="h-32" />
            <div className="flex-grow">
              <h2 className="font-semibold mb-1">
                {item.itemid || item.displayname}
              </h2>
              <p className="text-gray-600">${item.unitprice || item.price}</p>
              {item.flavor && (
                <p className="mt-2 text-sm"><span className="font-medium">Flavours:</span> {item.flavor}</p>
              )}
              <div className="mt-2 w-24">
                <InputField
                  label="Quantity:"
                  type="number"
                  min={1}
                  value={item.quantity}
                  disabled={true}
                />
              </div>
              <p className="mt-2 text-sm">
                <span className="font-medium">Amount:</span>{" "}
                <span className="font-bold">${((item.unitprice || item.price || 0) * item.quantity).toFixed(2)}</span>
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center mt-6 text-sm text-blue-700 font-medium">Your cart is empty.</p>
      )}

      {/* Order Summary */}
      {cart.length > 0 && (
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2" />
          <div className="border p-6 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between mb-2 text-sm">
              <span>Subtotal {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}</span>
              <span className="font-semibold">${subtotal}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Subtotal Does Not Include Shipping Or Tax
            </p>
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Estimate Tax & Shipping</h4>
              <p className="text-xs mb-2">Ship available only to Canada</p>
              <InputField
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
              <button className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800">
                ESTIMATE
              </button>
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Have a Promo Code?</h4>
              <div className="flex gap-2">
                <InputField
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo Code"
                />
                <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
                  APPLY
                </button>
              </div>
            </div>
            <button className="w-full mt-4 bg-purple-800 text-white py-3 rounded hover:bg-purple-900">
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
