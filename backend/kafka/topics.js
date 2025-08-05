// Kafka Topics Configuration
const TOPICS = {
    // Order Events
    ORDER_CREATED: 'order.created',
    ORDER_UPDATED: 'order.updated',
    ORDER_CANCELLED: 'order.cancelled',
    ORDER_SHIPPED: 'order.shipped',
    ORDER_DELIVERED: 'order.delivered',

    // Payment Events
    PAYMENT_INITIATED: 'payment.initiated',
    PAYMENT_COMPLETED: 'payment.completed',
    PAYMENT_FAILED: 'payment.failed',

    // Customer Events
    CUSTOMER_CREATED: 'customer.created',
    CUSTOMER_UPDATED: 'customer.updated',

    // Inventory Events
    INVENTORY_UPDATED: 'inventory.updated',
    INVENTORY_LOW_STOCK: 'inventory.low_stock',

    // Fulfillment Events
    FULFILLMENT_STARTED: 'fulfillment.started',
    FULFILLMENT_COMPLETED: 'fulfillment.completed',

    // Notification Events
    EMAIL_NOTIFICATION: 'notification.email',
    SMS_NOTIFICATION: 'notification.sms'
};

module.exports = TOPICS;
