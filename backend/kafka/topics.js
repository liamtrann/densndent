// topics.js
// Kafka topic definitions

module.exports = {
    // Order related topics
    ORDER_CREATED: 'order-created',
    ORDER_UPDATED: 'order-updated',
    ORDER_CANCELLED: 'order-cancelled',

    // Payment related topics
    PAYMENT_REQUESTED: 'payment-requested',
    PAYMENT_COMPLETED: 'payment-completed',
    PAYMENT_FAILED: 'payment-failed',
    PAYMENT_REFUNDED: 'payment-refunded',

    // Fulfillment related topics
    FULFILLMENT_REQUESTED: 'fulfillment-requested',
    FULFILLMENT_COMPLETED: 'fulfillment-completed',
    FULFILLMENT_FAILED: 'fulfillment-failed',

    // Inventory related topics
    INVENTORY_UPDATED: 'inventory-updated',
    INVENTORY_LOW_STOCK: 'inventory-low-stock',

    // Customer related topics
    CUSTOMER_CREATED: 'customer-created',
    CUSTOMER_UPDATED: 'customer-updated'
};
