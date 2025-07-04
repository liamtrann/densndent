import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Modal from "../components/Modal";
import { Loading, ErrorMessage, ProductImage, Paragraph, InputField, Button, ShowMoreHtml } from "../common";
import api from "../api/api";
import { addToCart } from "../redux/slices/cartSlice";
import endpoint from "../api/endpoints";
import { delayCall } from "../api/util";

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

  console.log(product)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        // Use centralized axios instance for API call
        const res = await api.get(
          endpoint.GET_PRODUCT_BY_ID(id)
        );
        setProduct(res.data);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const maxQty = product.totalquantityonhand || 9999;
    if (Number(quantity) > maxQty) {
      setAlertModal(true);
      return;
    }
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
    const maxQty = product?.totalquantityonhand || 9999;
    if (Number(value) > maxQty) {
      setAlertModal(true);
      setQuantity(maxQty);
    } else {
      setQuantity(value);
    }
  };

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
          <Paragraph className="text-2xl font-semibold mt-2">
            {product.price ? `$${product.price}` : ""}
          </Paragraph>
          {product.storedetaileddescription && (
            <ShowMoreHtml html={product.storedetaileddescription} maxLength={400} />
          )}
          <div className="text-sm text-gray-500 mt-4">
            MPN: {product.mpn}
          </div>
          <div className="mt-4">
            <label className="block mb-1 font-medium">Quantity:</label>
            <InputField
              type="number"
              min="1"
              max={product.totalquantityonhand || 9999}
              value={quantity}
              onChange={handleQuantityChange}
              className="px-2 py-1 w-24"
            />
          </div>

          <Button
            className={`mt-6 w-full ${(!product.totalquantityonhand || product.totalquantityonhand <= 0) ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60' : ''}`}
            onClick={product.totalquantityonhand && product.totalquantityonhand > 0 ? handleAddToCart : undefined}
            disabled={!product.totalquantityonhand || product.totalquantityonhand <= 0}
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
              price: product.price ? `$${product.price}` : "",
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
            Sorry, only {product.totalquantityonhand} in stock. Please adjust your quantity.
          </p>
        </Modal>
      )}
    </div>
  );
}
