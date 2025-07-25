import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Modal } from "components";
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
} from "common";
import api from "api/api";
import endpoint from "api/endpoints";
import { delayCall } from "api/util";
import { addToCart } from "store/slices/cartSlice";
import { useRecentViews } from "../hooks/useRecentViews";
import {
  getMatrixInfo,
  formatCurrency,
  useQuantityHandlers,
  extractBuyGet,
} from "config/config";
import { addToRecentViews } from "../redux/slices/recentViewsSlice";






export default function ProductsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [alertModal, setAlertModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [matrixOptions, setMatrixOptions] = useState([]);
  const [selectedMatrixOption, setSelectedMatrixOption] = useState("");

  // Use recent views hook
  const { addProductToRecentViews } = useRecentViews();

  // Use reusable quantity handlers with Buy X Get Y logic
  const {
    quantity,
    actualQuantity,
    handleQuantityChange,
    increment,
    decrement,
  } = useQuantityHandlers(1, product?.stockdescription);

  // ✅ Fetch product by ID
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(endpoint.GET_PRODUCT_BY_ID(id));
        setProduct(res.data);

        // ✅ Dispatch recently viewed product
        dispatch(addToRecentViews(res.data.id));

      } catch (err) {
        setError(err?.response?.data?.error || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, dispatch]);

  // ✅ Fetch matrix options (e.g., flavors/sizes)
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

  // Track product view for recent views
  useEffect(() => {
    if (id) {
      addProductToRecentViews(id);
    }
  }, [id, addProductToRecentViews]);

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = { ...product, quantity: Number(actualQuantity) };
    delayCall(() => {
      dispatch(addToCart(cartItem));
      Toast.success(`Added ${actualQuantity} ${product.itemid} to cart!`);
    });
  };

  const { matrixType, options: matrixOptionsList } =
    getMatrixInfo(matrixOptions);

  if (loading) return <Loading text="Loading product..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="overflow-hidden">
          <ProductImage
            src={product.file_url}
            className="w-full object-contain transition-transform duration-300 ease-in-out hover:scale-150 cursor-zoom-in"
          />
        </div>

        {/* Product Info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {product.itemid}
          </h2>

          {product.totalquantityonhand > 0 ? (
            <Paragraph className="text-green-700 font-semibold">
              Current Stock: {product.totalquantityonhand}
            </Paragraph>
          ) : (
            <Paragraph className="text-red-600 font-semibold">
              Out of stock
            </Paragraph>
          )}

          {product.price && (
            <div className="text-3xl font-bold text-gray-800 my-4">
              {formatCurrency(product.price)}
            </div>
          )}

          {product.storedetaileddescription && (
            <ShowMoreHtml
              html={product.storedetaileddescription}
              maxLength={400}
            />
          )}

          <div className="text-sm text-gray-500 mt-4">MPN: {product.mpn}</div>

          {matrixOptions.length > 0 && (
            <Dropdown
              label={matrixType}
              options={matrixOptionsList}
              value={selectedMatrixOption}
              key={selectedMatrixOption.value}
              onChange={(e) => {
                setSelectedMatrixOption(e.target.value);
                if (e.target.value && e.target.value !== product.id) {
                  navigate(`/product/${e.target.value}`);
                }
              }}
              className="w-48"
            />
          )}

          {/* Quantity Selector */}
          <div className="mt-4">
            <label className="block mb-1 font-medium">Quantity:</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded overflow-hidden h-9 w-32">
                <button
                  onClick={decrement}
                  className="px-2 h-9 text-sm hover:bg-gray-100 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  –
                </button>
                <InputField
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="flex-1 h-9 text-center text-sm border-0 focus:ring-1 focus:ring-blue-500"
                  disabled={!product.totalquantityonhand}
                />
                <button
                  onClick={increment}
                  className="px-2 h-9 text-sm hover:bg-gray-100 disabled:opacity-50"
                  disabled={!product.totalquantityonhand}
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

            {/* Bonus Info */}
            {actualQuantity > quantity && (
              <div className="mt-2 text-sm">
                <span className="text-gray-600">Selected: {quantity}</span>
                <span className="text-green-600 font-medium ml-2">
                  → With Bonus: {actualQuantity}
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <Button
            className={`mt-6 w-full ${
              !product.totalquantityonhand ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60" : ""
            }`}
            onClick={product.totalquantityonhand ? handleAddToCart : undefined}
            disabled={!product.totalquantityonhand}
          >
            Add to Shopping Cart
          </Button>
        </div>
      </div>

      {/* Stock Alert */}
      {alertModal && (
        <Modal
          title="Stock Limit Exceeded"
          onClose={() => setAlertModal(false)}
          onCloseText="OK"
        >
          <p>
            Sorry, only {product.totalquantityonhand} in stock. Please adjust
            your quantity.
          </p>
        </Modal>
      )}
    </div>
  );
}
