import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "store/slices/cartSlice";

import api from "api/api";
import endpoint from "api/endpoints";
import { delayCall } from "api/util";
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
  DeliveryEstimate,
} from "common";
import {
  getMatrixInfo,
  formatCurrency,
  useQuantityHandlers,
} from "config/config";

import { CURRENT_IN_STOCK, OUT_OF_STOCK } from "@/constants/constant";

export default function QuickLookModal({ productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const [matrixOptions, setMatrixOptions] = useState([]);
  const [selectedMatrixOption, setSelectedMatrixOption] = useState("");

  const {
    quantity,
    actualQuantity,
    handleQuantityChange,
    increment,
    decrement,
  } = useQuantityHandlers(1, product?.stockdescription);

  // fetch product
  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(endpoint.GET_PRODUCT_BY_ID(productId));
        setProduct(res.data);
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

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

  const handleAddToCart = () => {
    if (!product) return;
    const cartItem = {
      ...product,
      quantity: Number(actualQuantity),
    };

    delayCall(() => {
      dispatch(addToCart(cartItem));
      Toast.success(`Added ${actualQuantity} ${product.itemid} to cart!`);
      onClose(); // Close modal after adding to cart
    });
  };

  const { matrixType, options: matrixOptionsList } =
    getMatrixInfo(matrixOptions);

  if (loading)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg">
          <Loading text="Loading product..." />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md">
          <ErrorMessage message={error} />
          <Button onClick={onClose} className="mt-4 w-full">
            Close
          </Button>
        </div>
      </div>
    );

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Quick Look</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Product content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="overflow-hidden">
              <ProductImage
                src={product.file_url}
                className="w-full object-contain transition-transform duration-300 ease-in-out hover:scale-110"
              />
            </div>

            {/* Product Details */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {product.itemid}
              </h3>

              {/* Stock Status and Delivery */}
              {product.totalquantityonhand &&
              product.totalquantityonhand > 0 ? (
                <div className="mb-4">
                  <Paragraph className="text-smiles-blue font-semibold">
                    {CURRENT_IN_STOCK}: {product.totalquantityonhand}
                  </Paragraph>
                  <DeliveryEstimate inStock={true} size="default" />
                </div>
              ) : (
                <div className="mb-4">
                  <Paragraph className="text-smiles-orange font-semibold">
                    {OUT_OF_STOCK}
                  </Paragraph>
                  <DeliveryEstimate inStock={false} size="default" />
                </div>
              )}

              {/* Price */}
              <div className="mb-4">
                {product.price ? (
                  <div className="text-3xl font-bold text-gray-800">
                    {formatCurrency(product.price)}
                  </div>
                ) : null}
              </div>

              {/* Description */}
              {product.storedetaileddescription && (
                <div className="mb-4">
                  <ShowMoreHtml
                    html={product.storedetaileddescription}
                    maxLength={300}
                  />
                </div>
              )}

              {/* MPN */}
              <div className="text-sm text-gray-500 mb-4">
                MPN: {product.mpn}
              </div>

              {/* Matrix Options */}
              {matrixOptions.length > 0 && (
                <div className="mb-4">
                  <Dropdown
                    label={matrixType}
                    options={matrixOptionsList}
                    value={selectedMatrixOption}
                    onChange={(e) => {
                      setSelectedMatrixOption(e.target.value);
                      // Note: In modal, we don't navigate, just update selection
                    }}
                    className="w-48"
                  />
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block mb-2 font-medium">Quantity:</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded overflow-hidden h-10 w-32">
                    <button
                      onClick={decrement}
                      className="px-3 h-10 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      disabled={Number(quantity) <= 1}
                    >
                      –
                    </button>
                    <InputField
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="flex-1 h-10 text-center text-sm border-0 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={increment}
                      className="px-3 h-10 text-sm hover:bg-gray-100 flex items-center justify-center"
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

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
                <Button variant="outline" className="px-6" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
