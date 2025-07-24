const { kafka } = require('./kafka.config');
const kafkaProducer = require('./kafka.producer');
const TOPICS = require('./topics');

class FulfillmentService {
    constructor() {
        this.consumer = kafka.consumer({ groupId: 'fulfillment-service-group' });
        this.isRunning = false;
    }

    async start() {
        if (this.isRunning) {
            console.log('Fulfillment service is already running');
            return;
        }

        try {
            await this.consumer.connect();
            await this.consumer.subscribe({ topic: TOPICS.PAYMENT_COMPLETED });

            console.log('Fulfillment Service started, listening for payment completion events...');
            this.isRunning = true;

            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    try {
                        const paymentEvent = JSON.parse(message.value.toString());
                        console.log('Fulfillment Service received payment completion:', paymentEvent.orderId);

                        if (paymentEvent.eventType === 'PAYMENT_COMPLETED') {
                            await this.processFulfillment(paymentEvent);
                        }
                    } catch (error) {
                        console.error('Error processing payment completion in Fulfillment Service:', error);
                    }
                }
            });
        } catch (error) {
            console.error('Error starting Fulfillment Service:', error);
            this.isRunning = false;
        }
    }

    async processFulfillment(paymentEvent) {
        try {
            console.log(`Processing fulfillment for order ${paymentEvent.orderId}`);

            // Simulate fulfillment processing
            await this.updateInventory(paymentEvent.orderId);
            await this.createShippingLabel(paymentEvent.orderId);
            await this.updateNetSuiteOrder(paymentEvent);

            // Publish fulfillment ready event
            await kafkaProducer.sendMessage(TOPICS.FULFILLMENT_READY, {
                eventType: 'FULFILLMENT_READY',
                orderId: paymentEvent.orderId,
                customerId: paymentEvent.customerId,
                customerEmail: paymentEvent.customerEmail,
                status: 'ready_to_ship',
                trackingNumber: `TRK${Date.now()}`,
                estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                timestamp: new Date().toISOString()
            });

            // Publish notification event for payment confirmation
            await kafkaProducer.sendMessage(TOPICS.NOTIFICATION_SEND, {
                eventType: 'PAYMENT_CONFIRMATION',
                orderId: paymentEvent.orderId,
                customerId: paymentEvent.customerId,
                customerEmail: paymentEvent.customerEmail,
                amount: paymentEvent.amount,
                currency: paymentEvent.currency,
                message: `Payment of ${paymentEvent.currency} ${paymentEvent.amount} received successfully. Order ${paymentEvent.orderId} is being processed.`,
                timestamp: new Date().toISOString()
            });

            console.log(`Fulfillment processed for order ${paymentEvent.orderId}`);

        } catch (error) {
            console.error(`Fulfillment processing failed for order ${paymentEvent.orderId}:`, error);

            // Send error notification
            await kafkaProducer.sendMessage(TOPICS.NOTIFICATION_SEND, {
                eventType: 'FULFILLMENT_ERROR',
                orderId: paymentEvent.orderId,
                customerId: paymentEvent.customerId,
                customerEmail: paymentEvent.customerEmail,
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    async updateInventory(orderId) {
        // Simulate inventory update
        console.log(`Updating inventory for order ${orderId}`);
        // In real implementation, you would:
        // - Reduce inventory quantities
        // - Update stock levels in database
        // - Check for low stock alerts

        return new Promise(resolve => setTimeout(resolve, 500));
    }

    async createShippingLabel(orderId) {
        // Simulate shipping label creation
        console.log(`Creating shipping label for order ${orderId}`);
        // In real implementation, you would:
        // - Integrate with shipping provider API (UPS, FedEx, etc.)
        // - Generate shipping label
        // - Get tracking number

        return new Promise(resolve => setTimeout(resolve, 300));
    }

    async updateNetSuiteOrder(paymentEvent) {
        try {
            console.log(`Updating NetSuite order ${paymentEvent.orderId} with payment info`);

            // Here you would integrate with your existing NetSuite service
            // const netsuiteService = require('../restapi/restapi.service');
            // 
            // await netsuiteService.patchRecord('salesorder', paymentEvent.orderId, {
            //   custbody_payment_status: 'Paid',
            //   custbody_transaction_id: paymentEvent.transactionId,
            //   custbody_payment_amount: paymentEvent.amount
            // });

            // For now, just log the action
            console.log(`NetSuite order ${paymentEvent.orderId} marked as paid`);

        } catch (error) {
            console.error('Error updating NetSuite order:', error);
        }
    }

    async stop() {
        if (!this.isRunning) {
            return;
        }

        try {
            await this.consumer.disconnect();
            this.isRunning = false;
            console.log('Fulfillment Service stopped');
        } catch (error) {
            console.error('Error stopping Fulfillment Service:', error);
        }
    }
}

module.exports = FulfillmentService;
