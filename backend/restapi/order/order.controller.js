// order.controller.js
// Controller for order endpoints

const crypto = require('crypto');
const restApiService = require('../restapi.service');

// In-memory cache for recent orders (use Redis in production)
const recentOrders = new Map();
const WINDOW_MINUTES = Number(process.env.IDEMPOTENCY_WINDOW_MINUTES || 10);

function stableCartString(items = []) {
    return items
        .map(i => `${(i.item?.id || i.id)}x${(i.quantity || 1)}`)
        .sort()
        .join('|');
}

function makeServerIdempotencyKey(body = {}) {
    const customerId = body?.entity?.id || 'anon';
    const shipMethodId = body?.shipMethod?.id || 'na';
    const cartItems = Array.isArray(body?.item?.items) ? body.item.items : [];
    const cartStr = stableCartString(cartItems);
    const windowBucket = Math.floor(Date.now() / (WINDOW_MINUTES * 60 * 1000));
    const raw = `${customerId}|${shipMethodId}|${cartStr}|${windowBucket}`;
    const hash = crypto.createHash('sha256').update(raw).digest('hex').slice(0, 24);
    return `ck-${hash}`;
}

// Create a new sales order
const createSalesOrder = async (req, res, next) => {
    // Prefer client-provided idempotency key; else compute on server
    const clientKey = req.headers['idempotency-key'];
    const serverKey = makeServerIdempotencyKey(req.body);
    const idemKey = clientKey || serverKey;
    const externalId = `checkout-${idemKey}`;

    try {
        // Fast-path: return cached order if already created in the window
        const cached = recentOrders.get(idemKey);
        if (cached) {
            return res.status(200).json({ ...cached, isDuplicate: true });
        }

        const orderBody = { ...req.body, externalId };
        const result = await restApiService.postRecord('salesOrder', orderBody);

        // Cache for the configured window
        recentOrders.set(idemKey, result);
        setTimeout(() => recentOrders.delete(idemKey), WINDOW_MINUTES * 60 * 1000);

        return res.status(201).json(result);
    } catch (err) {
        // Handle duplicate external ID from NetSuite by fetching existing order
        const msg = err?.response?.data?.message || err?.message || '';
        if (msg.toLowerCase().includes('duplicate') || msg.toUpperCase().includes('DUPLICATE')) {
            try {
                const found = await restApiService.searchRecords('salesOrder', { externalId });
                if (Array.isArray(found) && found.length > 0) {
                    recentOrders.set(idemKey, found[0]);
                    setTimeout(() => recentOrders.delete(idemKey), WINDOW_MINUTES * 60 * 1000);
                    return res.status(200).json({ ...found[0], isDuplicate: true });
                }
            } catch (_) {
                // fall through
            }
        }
        return next(err);
    }
};

// Get a specific sales order by ID
const getSalesOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await restApiService.getRecord('salesOrder', id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// Update sales order
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await restApiService.patchRecord('salesOrder', id, req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createSalesOrder,
    getSalesOrder,
    updateOrderStatus
};
