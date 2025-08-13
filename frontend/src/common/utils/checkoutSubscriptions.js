// src/common/utils/checkoutSubscriptions.js
import { createSubscriptionsFromCart } from "store/slices/subscriptionsSlice";

/**
 * Create subscriptions for any cart items purchased with `subscriptionEnabled: true`.
 * Call this RIGHT AFTER your checkout succeeds.
 *
 * Example usage in checkout handler:
 *   import createSubscriptionsAfterCheckout from "common/utils/checkoutSubscriptions";
 *   await createSubscriptionsAfterCheckout({ cartItems, customerId, getAccessTokenSilently, dispatch });
 */
export async function createSubscriptionsAfterCheckout({
  cartItems,
  customerId,
  getAccessTokenSilently,
  dispatch,
}) {
  if (!dispatch) {
    throw new Error("createSubscriptionsAfterCheckout requires a Redux dispatch function");
  }

  const subscribedCount = Array.isArray(cartItems)
    ? cartItems.filter((it) => it?.subscriptionEnabled).length
    : 0;

  if (subscribedCount === 0) {
    return { ok: true, created: 0 };
  }

  const action = await dispatch(
    createSubscriptionsFromCart({
      cartItems,
      customerId: customerId ?? null,
      getAccessTokenSilently,
    })
  );

  if (action?.meta?.requestStatus === "rejected") {
    return {
      ok: false,
      created: 0,
      error: action?.payload || "Failed to create subscriptions",
    };
  }

  const created =
    action?.payload?.count ??
    cartItems.filter((it) => it?.subscriptionEnabled).length;

  return { ok: true, created };
}

export default createSubscriptionsAfterCheckout;
