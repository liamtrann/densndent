import { FiShoppingCart, FiEye } from "react-icons/fi";
import { useSelector } from "react-redux";

import {
  ProductImage,
  DeliveryEstimate,
  Button,
  FavoriteButton,
  QuantityControls,
} from "common";
import { FlexibleModal } from "components/layout";
import { formatCurrency } from "config/config";

import ProductDetail from "../../pages/ProductDetail";

import { CURRENT_IN_STOCK } from "@/constants/constant";

export default function ProductInListGrid({
  product,
  quantity,
  actualQuantity,
  handleQuantityChange,
  increment,
  decrement,
  handleAddToCart,
  handleNavigate,
  showQuickLook,
  setShowQuickLook,
}) {
  const { id, itemid, file_url, price, totalquantityonhand } = product;
  const inStock = Number(totalquantityonhand) > 0;

  // Get cart quantity for this item
  const cartItems = useSelector((state) => state.cart.items);
  const cartQuantity = cartItems.find((item) => item.id === id)?.quantity || 0;

  return (
    <>
      <div
        className="product-card border p-4 rounded shadow hover:shadow-md transition flex flex-col h-full group relative cursor-pointer"
        onClick={handleNavigate}
      >
        <div className="absolute top-2 right-2 z-20">
          <FavoriteButton itemId={id} />
        </div>

        <div className="absolute inset-0 bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity duration-200 rounded pointer-events-none" />
        <div className="relative group/image">
          <ProductImage src={file_url} />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setShowQuickLook(true);
              }}
              className="py-2 px-4 text-sm text-white bg-primary-blue border border-primary-blue rounded hover:bg-smiles-blue transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              <FiEye size={14} />
              Quick Look
            </Button>
          </div>
        </div>

        <h3 className="text-sm font-medium text-gray-900 mb-1 hover:underline line-clamp-2 min-h-[2.5rem]">
          {itemid}
        </h3>

        <div className="mb-2 flex flex-wrap gap-2">
          {product.promotioncode_id && product.promotion_code && (
            <span className="text-xs text-white font-medium bg-smiles-redOrange px-2 py-1 rounded">
              PROMO: {product.promotion_code}
            </span>
          )}
          {product.stockdescription && (
            <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
              {product.stockdescription}
            </span>
          )}
        </div>

        {actualQuantity > quantity && (
          <div className="mb-2 text-xs">
            <span className="text-gray-600">Selected: {quantity}</span>
            <span className="text-green-600 font-medium ml-1">
              → Total: {actualQuantity} items
            </span>
          </div>
        )}

        <div className="mb-2">
          {product.promotioncode_id && product.fixedprice ? (
            <div className="space-y-1">
              <div className="text-gray-500 line-through text-xs">
                {formatCurrency(price)}
              </div>
              <div className="text-red-600 font-semibold text-xl">
                {formatCurrency(product.fixedprice)}
              </div>
              <div className="text-green-600 text-xs">
                Save {formatCurrency(price - product.fixedprice)}
              </div>
            </div>
          ) : (
            <div>
              <span className="text-xl font-bold text-gray-800">
                {formatCurrency(price)}
              </span>
            </div>
          )}
        </div>

        {/* >>> Boxed stock badges */}
        <div className="flex-grow">
          {inStock ? (
            <div className="mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium">
                {CURRENT_IN_STOCK}
              </span>
              <DeliveryEstimate
                inStock={true}
                size="small"
                className="mt-1 rounded"
              />
            </div>
          ) : (
            <div className="mb-2">
              <DeliveryEstimate
                inStock={false}
                size="small"
                className="mt-1 rounded"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-auto gap-2">
          <div onClick={(e) => e.stopPropagation()}>
            <QuantityControls
              quantity={quantity}
              onDecrement={decrement}
              onIncrement={increment}
              min={1}
              max={999}
            />
          </div>

          <div className="relative">
            <FiShoppingCart
              size={30}
              className="text-primary-blue hover:text-smiles-blue hover:scale-150 cursor-pointer transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              aria-label="Add to cart"
            />
            {cartQuantity > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]">
                {cartQuantity > 99 ? "99+" : cartQuantity}
              </div>
            )}
          </div>
        </div>
      </div>

      {showQuickLook && (
        <FlexibleModal
          title="Quick Look"
          onClose={() => setShowQuickLook(false)}
        >
          <ProductDetail productId={id} isModal={true} />
        </FlexibleModal>
      )}
    </>
  );
}
