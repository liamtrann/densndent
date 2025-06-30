import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Modal from "../components/Modal";
import { Loading, ErrorMessage, ProductImage, Paragraph, Dropdown, InputField, Button } from "../common";
import api from "../api/api";
import { addToCart } from "../redux/slices/cartSlice";

export default function ProductsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [flavor, setFlavor] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        // Use centralized axios instance for API call
        const res = await api.get(
          `/suiteql/item/by-id-with-base-price?id=${id}`
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
    // Store all product details, only change quantity
    const cartItem = { ...product, quantity: Number(quantity), flavor: flavor || undefined };
    dispatch(addToCart(cartItem));
    setShowModal(true);
  };

  const handleViewCart = () => {
    navigate("/cart");
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
            {product.unitprice ? `$${product.unitprice}` : ""}
          </Paragraph>
          {/* Example promo */}
          <Paragraph className="text-sm text-gray-600 mt-1">
            BUY 3 GET 1 FREE (this is fixed for now)
          </Paragraph>

          {/* Flavors (if available) */}
          {product.flavors && product.flavors.length > 0 && (
            <div className="mt-4">
              <label className="block mb-1 font-medium">Flavours:</label>
              <Dropdown
                options={product.flavors}
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
              />
            </div>
          )}

          <div className="mt-4">
            <label className="block mb-1 font-medium">Quantity:</label>
            <InputField
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
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

          <div className="text-sm text-gray-500 mt-4">
            MPN: {product.mpn}
          </div>
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
              price: product.unitprice ? `$${product.unitprice}` : "",
              flavor,
              quantity,
            },
          ]}
          onSubmit={handleViewCart}
          onCloseText="Continue Shopping"
          onSubmitText="View Cart"
        />
      )}
    </div>
  );
}
