import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputField from "../common/InputField";
import Modal from "../components/Modal";
import { removeFromCart, addToCart } from "../redux/slices/cartSlice";
import { ProductImage } from "../common";
import { delayCall } from "../api/util";

export default function CartPage() {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [postalCode, setPostalCode] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Calculate subtotal and total quantity
  const subtotal = cart.reduce((sum, item) => sum + (item.unitprice || item.price || 0) * item.quantity, 0).toFixed(2);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Handle quantity change
  const handleQuantityChange = (item, value) => {
    const newQuantity = Math.max(1, Math.min(Number(value), item.totalquantityonhand || 9999));
    if (newQuantity !== item.quantity) {
      delayCall(() => dispatch(addToCart({ ...item, quantity: newQuantity - item.quantity })));
    }
  };

  // Handle remove
  const handleRemoveClick = (item) => {
    setSelectedProduct(item);
    setModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (selectedProduct) {
      delayCall(() => dispatch(removeFromCart(selectedProduct.id)));
      setModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleCancelRemove = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleNavigateToProduct = (id) => {
    navigate(`/product/${id}`);
  };

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
            <span
              className="cursor-pointer"
              onClick={() => handleNavigateToProduct(item.id)}
            >
              <ProductImage src={item.file_url} alt={item.itemid || item.displayname || "Product"} className="h-32" />
            </span>
            <div className="flex-grow">
              <h2
                className="font-semibold mb-1 cursor-pointer hover:underline"
                onClick={() => handleNavigateToProduct(item.id)}
              >
                {item.itemid || item.displayname}
              </h2>
              <p className="text-gray-600">${item.unitprice || item.price}</p>
              {typeof item.totalquantityonhand !== 'undefined' && (
                <p className={
                  item.totalquantityonhand > 0
                    ? "text-green-700 font-semibold text-sm mb-1"
                    : "text-red-600 font-semibold text-sm mb-1"
                }>
                  {item.totalquantityonhand > 0
                    ? `Current Stock: ${item.totalquantityonhand}`
                    : "Out of stock"}
                </p>
              )}
              <div className="mt-2 w-24">
                <InputField
                  label="Quantity:"
                  type="number"
                  min={1}
                  max={item.totalquantityonhand || 9999}
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item, e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm">
                <span className="font-medium">Amount:</span>{" "}
                <span className="font-bold">${((item.unitprice || item.price || 0) * item.quantity).toFixed(2)}</span>
              </p>
              <button
                className="mt-2 text-red-600 underline text-sm"
                onClick={() => handleRemoveClick(item)}
              >
                Remove
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center mt-6 text-sm text-blue-700 font-medium">Your cart is empty.</p>
      )}

      {/* Remove Confirmation Modal */}
      {modalOpen && selectedProduct && (
        <Modal
          title="Remove Product"
          onClose={handleCancelRemove}
          onSubmit={handleConfirmRemove}
          onCloseText="Cancel"
          onSubmitText="Remove"
          image={selectedProduct.file_url}
          product={[
            {
              name: selectedProduct.displayname || selectedProduct.itemid,
              price: selectedProduct.unitprice || selectedProduct.price,
              quantity: selectedProduct.quantity,
            },
          ]}
        >
          <p>Are you sure you want to remove this product from your cart?</p>
        </Modal>
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
            <button
              className="w-full mt-4 bg-purple-800 text-white py-3 rounded hover:bg-purple-900"
              onClick={() => navigate("/checkout")}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
