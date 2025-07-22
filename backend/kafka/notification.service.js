const { kafka } = require('./kafka.config');
const TOPICS = require('./topics');

class NotificationService {
    constructor() {
        this.consumer = kafka.consumer({ groupId: 'notification-service-group' });
        this.isRunning = false;
    }

    async start() {
        if (this.isRunning) {
            console.log('Notification service is already running');
            return;
        }

        try {
            await this.consumer.connect();
            await this.consumer.subscribe({
                topics: [
                    TOPICS.PAYMENT_CREATED,
                    TOPICS.PAYMENT_COMPLETED,
                    TOPICS.FULFILLMENT_READY,
                    TOPICS.NOTIFICATION_SEND
                ]
            });

            console.log('Notification Service started, listening for events...');
            this.isRunning = true;

            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    try {
                        const event = JSON.parse(message.value.toString());
                        console.log(`Notification Service received ${event.eventType} event`);

                        switch (event.eventType) {
                            case 'PAYMENT_CREATED':
                                await this.sendPaymentCreatedNotification(event);
                                break;
                            case 'PAYMENT_COMPLETED':
                                await this.sendPaymentCompletedNotification(event);
                                break;
                            case 'FULFILLMENT_READY':
                                await this.sendFulfillmentNotification(event);
                                break;
                            case 'PAYMENT_CONFIRMATION':
                                await this.sendPaymentConfirmationNotification(event);
                                break;
                            case 'PAYMENT_FAILED':
                                await this.sendPaymentFailedNotification(event);
                                break;
                            case 'FULFILLMENT_ERROR':
                                await this.sendFulfillmentErrorNotification(event);
                                break;
                            default:
                                console.log(`Unhandled notification event type: ${event.eventType}`);
                        }
                    } catch (error) {
                        console.error('Error processing notification event:', error);
                    }
                }
            });
        } catch (error) {
            console.error('Error starting Notification Service:', error);
            this.isRunning = false;
        }
    }

    async sendPaymentCreatedNotification(event) {
        try {
            console.log(`📧 Sending payment link to customer ${event.customerEmail}`);

            // In real implementation, you would send email with payment URL
            const emailContent = {
                to: event.customerEmail,
                subject: `Complete Your Payment - Order ${event.orderId}`,
                body: `
          Dear Customer,
          
          Thank you for your order ${event.orderId}.
          
          Please complete your payment of ${event.currency} ${event.amount} using the following link:
          ${event.paymentUrl}
          
          If you have any questions, please contact our support team.
          
          Best regards,
          DensNDent Team
        `
            };

            // await emailService.send(emailContent);
            console.log('Payment link email sent successfully');

        } catch (error) {
            console.error('Error sending payment created notification:', error);
        }
    }

    async sendPaymentCompletedNotification(event) {
        try {
            console.log(`✅ Sending payment confirmation to customer ${event.customerEmail}`);

            const emailContent = {
                to: event.customerEmail,
                subject: `Payment Confirmed - Order ${event.orderId}`,
                body: `
          Dear Customer,
          
          Your payment has been successfully processed!
          
          Order Details:
          - Order ID: ${event.orderId}
          - Amount: ${event.currency} ${event.amount}
          - Transaction ID: ${event.transactionId}
          - Date: ${new Date(event.timestamp).toLocaleDateString()}
          
          Your order is now being processed and you will receive a shipping notification soon.
          
          Best regards,
          DensNDent Team
        `
            };

            // await emailService.send(emailContent);
            console.log('Payment confirmation email sent successfully');

        } catch (error) {
            console.error('Error sending payment completed notification:', error);
        }
    }

    async sendFulfillmentNotification(event) {
        try {
            console.log(`📦 Sending shipping notification to customer ${event.customerEmail}`);

            const emailContent = {
                to: event.customerEmail,
                subject: `Your Order is Shipping - Order ${event.orderId}`,
                body: `
          Dear Customer,
          
          Great news! Your order ${event.orderId} is ready to ship.
          
          Shipping Details:
          - Tracking Number: ${event.trackingNumber}
          - Estimated Delivery: ${new Date(event.estimatedDelivery).toLocaleDateString()}
          
          You can track your package using the tracking number provided.
          
          Best regards,
          DensNDent Team
        `
            };

            // await emailService.send(emailContent);
            console.log('Shipping notification email sent successfully');

        } catch (error) {
            console.error('Error sending fulfillment notification:', error);
        }
    }

    async sendPaymentConfirmationNotification(event) {
        try {
            console.log(`💳 Sending payment confirmation to customer ${event.customerEmail}`);

            const emailContent = {
                to: event.customerEmail,
                subject: `Payment Received - Order ${event.orderId}`,
                body: `
          Dear Customer,
          
          ${event.message}
          
          We will notify you once your order ships.
          
          Best regards,
          DensNDent Team
        `
            };

            // await emailService.send(emailContent);
            console.log('Payment confirmation notification sent successfully');

        } catch (error) {
            console.error('Error sending payment confirmation notification:', error);
        }
    }

    async sendPaymentFailedNotification(event) {
        try {
            console.log(`❌ Sending payment failure notification to customer ${event.customerEmail}`);

            const emailContent = {
                to: event.customerEmail,
                subject: `Payment Processing Issue - Order ${event.orderId}`,
                body: `
          Dear Customer,
          
          We encountered an issue processing your payment for order ${event.orderId}.
          
          Error: ${event.error}
          
          Please try placing your order again or contact our support team for assistance.
          
          Best regards,
          DensNDent Team
        `
            };

            // await emailService.send(emailContent);
            console.log('Payment failure notification sent successfully');

        } catch (error) {
            console.error('Error sending payment failed notification:', error);
        }
    }

    async sendFulfillmentErrorNotification(event) {
        try {
            console.log(`⚠️ Sending fulfillment error notification for order ${event.orderId}`);

            // This would typically go to internal staff, not customer
            const emailContent = {
                to: 'fulfillment@densndent.com',
                subject: `Fulfillment Error - Order ${event.orderId}`,
                body: `
          Fulfillment processing failed for order ${event.orderId}.
          
          Customer: ${event.customerEmail}
          Error: ${event.error}
          Timestamp: ${event.timestamp}
          
          Please investigate and resolve manually.
        `
            };

            // await emailService.send(emailContent);
            console.log('Fulfillment error notification sent to staff');

        } catch (error) {
            console.error('Error sending fulfillment error notification:', error);
        }
    }

    async stop() {
        if (!this.isRunning) {
            return;
        }

        try {
            await this.consumer.disconnect();
            this.isRunning = false;
            console.log('Notification Service stopped');
        } catch (error) {
            console.error('Error stopping Notification Service:', error);
        }
    }
}

module.exports = NotificationService;
