import { FiEye, FiShoppingCart } from "react-icons/fi";
import { useSelector } from "react-redux";

import {
  Button,
  ProductImage,
  DeliveryEstimate,
  FavoriteButton,
  QuantityControls,
} from "common";
import { FlexibleModal } from "components/layout";
import { formatCurrency } from "config/config";

import ProductDetail from "../../pages/ProductDetail";

import { CURRENT_IN_STOCK, OUT_OF_STOCK } from "@/constants/constant";

/** One product per row with responsive (mobile vs desktop) layouts */
export default function ProductInListRow({
  product,
  quantity,
  actualQuantity,
  handleQuantityChange,
  increment,
  decrement,
  handleAddToCart,
  handleNavigate,
  showQuickLook,
  quickLookProductId,
  handleQuickLook,
  handleCloseQuickLook,
}) {
  // Get cart items from Redux store (must be before early return)
  const cartItems = useSelector((state) => state.cart.items || []);

  // Early return if no product
  if (!product) return null;

  // Calculate quantity of this item in the cart
  const cartQuantity =
    cartItems.find((item) => item.id === product.id)?.quantity || 0;

  // Small aligned qty control (shared by both views)
  const QtyControl = () => (
    <div onClick={(e) => e.stopPropagation()}>
      <QuantityControls
        quantity={quantity}
        onDecrement={decrement}
        onIncrement={increment}
        min={1}
        max={999}
      />
    </div>
  );

  return (
    <div className="p-4">
      {(() => {
        const inStock = Number(product.totalquantityonhand) > 0;
        const Name = (
          <div
            className="text-base font-medium text-gray-900 hover:underline"
            title={product.itemid || product.displayname}
          >
            {product.itemid || product.displayname}
          </div>
        );

        // >>> Boxed stock badges
        const Badges = (
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {inStock ? (
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium">
                  {CURRENT_IN_STOCK}
                </span>
                <DeliveryEstimate
                  inStock={true}
                  size="small"
                  className="rounded"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <DeliveryEstimate
                  inStock={false}
                  size="small"
                  className="rounded"
                />
              </div>
            )}

            {/* Promotion badge */}
            {product.promotioncode_id && product.promotion_code && (
              <div className="mb-2">
                <span className="text-xs text-white font-medium bg-smiles-redOrange px-2 py-1 rounded">
                  PROMO: {product.promotion_code}
                </span>
              </div>
            )}
            {product.stockdescription && (
              <div className="mb-2">
                <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
                  {product.stockdescription}
                </span>
              </div>
            )}
            {actualQuantity > quantity && (
              <div className="mb-2">
                <span className="text-sm bg-gray-50 px-2 py-1 rounded">
                  <span className="text-gray-600">Selected: {quantity}</span>
                  <span className="text-green-600 font-medium ml-1">
                    → Total: {actualQuantity} items
                  </span>
                </span>
              </div>
            )}
          </div>
        );

        // const ShortDesc = product.storedetaileddescription ? (
        //   <div
        //     className="mt-1 text-sm text-gray-600 line-clamp-2"
        //     title={product.storedetaileddescription.replace(/<[^>]*>/g, "")}
        //     dangerouslySetInnerHTML={{
        //       __html: product.storedetaileddescription,
        //     }}
        //   />
        // ) : product.displayname ? (
        //   <div className="mt-1 text-sm text-gray-600 line-clamp-2">
        //     {product.displayname}
        //   </div>
        // ) : null;

        const Price =
          product.promotioncode_id && product.fixedprice ? (
            <div className="space-y-1">
              <div className="text-gray-500 line-through text-xs">
                {product.price != null ? formatCurrency(product.price) : "—"}
              </div>
              <div className="text-red-600 font-semibold text-lg md:text-xl">
                {formatCurrency(product.fixedprice)}
              </div>
              <div className="text-green-600 text-xs">
                Save {formatCurrency(product.price - product.fixedprice)}
              </div>
            </div>
          ) : (
            <div className="text-lg md:text-xl font-bold text-gray-900">
              {product.price != null ? formatCurrency(product.price) : "—"}
            </div>
          );

        return (
          <>
            {/* Mobile */}
            <div
              className="md:hidden cursor-pointer relative group/mobile"
              onClick={() => handleNavigate()}
            >
              <div className="absolute top-2 right-2 z-20">
                <FavoriteButton itemId={product.id} size={16} />
              </div>

              <div className="absolute inset-0 bg-gray-200 opacity-0 group-hover/mobile:opacity-20 transition-opacity duration-200 rounded pointer-events-none" />
              <div className="grid grid-cols-[5rem,1fr] gap-3">
                <div className="col-span-1 relative group">
                  <ProductImage
                    src={product.file_url}
                    alt={product.itemid || product.displayname}
                    className="w-20 h-20 object-contain border rounded"
                  />
                </div>

                <div className="col-span-1">
                  {Name}
                  {Badges}
                  {/* {ShortDesc} */}
                </div>

                <div className="col-span-2 mt-1 flex items-center justify-between">
                  {Price}
                  <div className="flex flex-col items-end gap-1">
                    <QtyControl />
                    {actualQuantity > quantity && (
                      <span className="text-xs text-green-600 font-medium">
                        = {actualQuantity} total
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-span-2 flex justify-end items-center gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickLook(product.id);
                    }}
                    className="opacity-0 group-hover/desktop:opacity-100 transition-opacity duration-200 h-8 px-2 text-xs bg-gray-100 text-white-700 border border-gray-300 hover:bg-smiles-blue rounded flex items-center gap-1"
                  >
                    <FiEye size={12} />
                  </Button>
                  <div className="relative">
                    <FiShoppingCart
                      size={30}
                      className="text-primary-blue hover:text-smiles-blue hover:scale-150 cursor-pointer transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart();
                      }}
                      aria-label={`Add ${actualQuantity} to cart`}
                      title={
                        actualQuantity > quantity
                          ? `Add ${actualQuantity} items (includes bonus!)`
                          : `Add ${quantity} to cart`
                      }
                    />
                    {cartQuantity > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]">
                        {cartQuantity > 99 ? "99+" : cartQuantity}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop / Tablet */}
            <div
              className="hidden md:flex md:flex-row items-center gap-4 cursor-pointer relative group/desktop"
              onClick={() => handleNavigate()}
            >
              <div className="absolute inset-0 bg-gray-200 opacity-0 group-hover/desktop:opacity-20 transition-opacity duration-200 rounded pointer-events-none" />
              <div className="w-24 shrink-0 relative group">
                <ProductImage
                  src={product.file_url}
                  alt={product.itemid || product.displayname}
                  className="w-24 h-24 object-contain border rounded"
                />
              </div>

              <div className="flex-1 min-w-0">
                {Name}
                {Badges}
                {/* {ShortDesc} */}
              </div>

              <div className="md:w-32">{Price}</div>

              <div className="flex flex-col items-end gap-1">
                <QtyControl />
                {actualQuantity > quantity && (
                  <span className="text-xs text-green-600 font-medium">
                    = {actualQuantity} total
                  </span>
                )}
              </div>

              <div className="md:w-32 flex justify-end items-center gap-2">
                <FavoriteButton itemId={product.id} size={18} />
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuickLook(product.id);
                  }}
                  className="opacity-0 group-hover/desktop:opacity-100 transition-opacity duration-200 h-8 px-2 text-xs bg-gray-100 text-white-700 border border-gray-300 hover:bg-smiles-blue rounded flex items-center gap-1"
                >
                  <FiEye size={12} />
                </Button>
                <div className="relative">
                  <FiShoppingCart
                    size={24}
                    className="text-primary-blue hover:text-smiles-blue hover:scale-150 cursor-pointer transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart();
                    }}
                    aria-label={`Add ${actualQuantity} to cart`}
                    title={
                      actualQuantity > quantity
                        ? `Add ${actualQuantity} items (includes bonus!)`
                        : `Add ${quantity} to cart`
                    }
                  />
                  {cartQuantity > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[1.25rem]">
                      {cartQuantity > 99 ? "99+" : cartQuantity}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {showQuickLook && quickLookProductId && (
        <FlexibleModal title="Quick Look" onClose={handleCloseQuickLook}>
          <ProductDetail productId={quickLookProductId} isModal={true} />
        </FlexibleModal>
      )}
    </div>
  );
}
