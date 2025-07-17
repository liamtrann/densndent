import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Modal } from "components";
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
import { getMatrixInfo, formatCurrency } from "config/config";

export default function ProductsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [matrixOptions, setMatrixOptions] = useState([]);
  const [selectedMatrixOption, setSelectedMatrixOption] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        // Use centralized axios instance for API call
        const res = await api.get(endpoint.GET_PRODUCT_BY_ID(id));
        setProduct(res.data);
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product || !product.custitem39) return;
    // Fetch products with the same custitem39 (parent key)
    async function fetchMatrixOptions() {
      try {
        const res = await api.post(endpoint.POST_GET_PRODUCT_BY_PARENT(), {
          parent: product.custitem39,
        });
        setMatrixOptions(res.data || []);
      } catch (err) {
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
    // Store all product details, only change quantity
    const cartItem = { ...product, quantity: Number(quantity) };
    delayCall(() => dispatch(addToCart(cartItem)));
    setShowModal(true);
  };

  const handleViewCart = () => {
    navigate("/cart");
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (Number(value) < 1) {
      setQuantity(1);
    } else {
      setQuantity(value);
    }
  };

  const increment = () => {
    setQuantity((prev) => Number(prev) + 1);
  };

  const decrement = () => {
    if (Number(quantity) > 1) {
      setQuantity((prev) => Number(prev) - 1);
    }
  };

  const { matrixType, options: matrixOptionsList } =
    getMatrixInfo(matrixOptions);

  if (loading) return <Loading text="Loading product..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="overflow-hidden">
          <ProductImage
            src={product.file_url}
            className="w-full object-contain transition-transform duration-300 ease-in-out hover:scale-150 cursor-zoom-in"
          />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {product.itemid}
          </h2>
          {product.totalquantityonhand && product.totalquantityonhand > 0 ? (
            <Paragraph className="text-green-700 font-semibold">
              Current Stock: {product.totalquantityonhand}
            </Paragraph>
          ) : (
            <Paragraph className="text-red-600 font-semibold">
              Out of stock
            </Paragraph>
          )}
          <div className="mt-2 mb-4">
            {product.price ? (
              <div className="text-3xl font-bold text-gray-800">
                {formatCurrency(product.price)}
              </div>
            ) : null}
          </div>
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

          <div className="mt-4">
            <label className="block mb-1 font-medium">Quantity:</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded overflow-hidden h-9 w-32">
                <button
                  onClick={decrement}
                  className="px-2 h-9 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={
                    !product.totalquantityonhand ||
                    product.totalquantityonhand <= 0 ||
                    Number(quantity) <= 1
                  }
                >
                  –
                </button>
                <InputField
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="flex-1 h-9 text-center text-sm border-0 focus:ring-1 focus:ring-blue-500"
                  disabled={
                    !product.totalquantityonhand ||
                    product.totalquantityonhand <= 0
                  }
                />
                <button
                  onClick={increment}
                  className="px-2 h-9 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={
                    !product.totalquantityonhand ||
                    product.totalquantityonhand <= 0
                  }
                >
                  +
                </button>
              </div>
              {product.stockdescription && (
                <span className="text-sm text-gray-600">
                  {product.stockdescription}
                </span>
              )}
            </div>
          </div>

          <Button
            className={`mt-6 w-full ${
              !product.totalquantityonhand || product.totalquantityonhand <= 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                : ""
            }`}
            onClick={
              product.totalquantityonhand && product.totalquantityonhand > 0
                ? handleAddToCart
                : undefined
            }
            disabled={
              !product.totalquantityonhand || product.totalquantityonhand <= 0
            }
          >
            Add to Shopping Cart
          </Button>
        </div>
      </div>

      {/* Modal for cart confirmation */}
      {showModal && (
        <Modal
          title="Added to Cart"
          onClose={() => setShowModal(false)}
          image={product.file_url}
          product={[
            {
              name: product.displayname || product.itemid,
              price: formatCurrency(product.price),
              stockdescription: product.stockdescription,
              quantity,
            },
          ]}
          onSubmit={handleViewCart}
          onCloseText="Continue Shopping"
          onSubmitText="View Cart"
        />
      )}
      {/* Alert Modal for stock limit */}
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
