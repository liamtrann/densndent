// src/common/utils/checkoutSubscriptions.js
// Helper you can call right after a successful checkout to create
// recurring-order records for cart items that were "Subscribe & Save".

import api from "api/api";
import endpoint from "api/endpoints";

/**
 * Create recurring-order records for subscribed cart items.
 *
 * @param {Object} args
 * @param {Array}  args.cartItems  - full cart items
 * @param {string|number} args.customerId - NetSuite customer internal id
 * @param {Function} [args.getAccessTokenSilently] - optional Auth0 getter
 * @returns {Promise<{created:number, errors:number, details:Array}>}
 */
export async function createSubscriptionsFromCart({
  cartItems,
  customerId,
  getAccessTokenSilently,
}) {
  const details = [];
  let created = 0;
  let errors = 0;

  const token = getAccessTokenSilently
    ? await getAccessTokenSilently().catch(() => null)
    : null;
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  const subscribed = (cartItems || []).filter((i) => i.subscriptionEnabled);

  for (const it of subscribed) {
    const interval = String(it.subscriptionInterval || "1");
    const unit = it.subscriptionUnit || "months";
    const quantity = Number(it.quantity || 1);

    try {
      await api.post(
        endpoint.POST_RECURRING_ORDER(),
        {
          customerId,
          itemId: it.id, // your product/item internal id
          interval,
          unit,
          quantity,
        },
        { headers }
      );

      created += 1;
      details.push({ id: it.id, status: "ok" });
    } catch (err) {
      errors += 1;
      details.push({
        id: it.id,
        status: "error",
        message: err?.response?.data || err?.message,
      });
    }
  }

  return { created, errors, details };
}

export default createSubscriptionsFromCart;
