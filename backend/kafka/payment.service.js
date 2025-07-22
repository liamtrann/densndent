const { consumer } = require('./kafka.config');
const kafkaProducer = require('./kafka.producer');
const VersaPayClient = require('./versapay.client');
const TOPICS = require('./topics');
const { v4: uuidv4 } = require('uuid');

class PaymentService {
  constructor() {
    this.versapay = new VersaPayClient();
    this.isRunning = false;
  }

  async start() {
    if (this.isRunning) {
      console.log('Payment service is already running');
      return;
    }

    try {
      await consumer.connect();
      await consumer.subscribe({ topic: TOPICS.ORDER_CREATED });
      
      console.log('Payment Service started, listening for order events...');
      this.isRunning = true;

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const orderEvent = JSON.parse(message.value.toString());
            console.log('Payment Service received order event:', orderEvent.orderId);

            if (orderEvent.eventType === 'ORDER_CREATED') {
              await this.processPayment(orderEvent);
            }
          } catch (error) {
            console.error('Error processing order event in Payment Service:', error);
          }
        }
      });
    } catch (error) {
      console.error('Error starting Payment Service:', error);
      this.isRunning = false;
    }
  }

  async processPayment(orderEvent) {
    try {
      const paymentId = uuidv4();
      console.log(`Processing payment ${paymentId} for order ${orderEvent.orderId}`);

      // Step 1: Create or get customer in VersaPay
      const customer = await this.versapay.createCustomer({
        name: orderEvent.customerName || 'Guest Customer',
        email: orderEvent.customerEmail,
        customerNumber: orderEvent.customerId
      });

      // Step 2: Create invoice in VersaPay
      const invoice = await this.versapay.createInvoice({
        customerId: customer.id,
        invoiceNumber: `INV-${orderEvent.orderId}`,
        total: orderEvent.totalAmount,
        currency: orderEvent.currency,
        lineItems: orderEvent.items ? orderEvent.items.map(item => ({
          description: item.name || item.description,
          quantity: item.quantity,
          unit_price: item.price.toString()
        })) : undefined
      });

      // Step 3: Create gateway transaction
      const gatewayTransaction = await this.versapay.createGatewayTransaction({
        customerId: customer.id,
        invoiceId: invoice.id,
        amount: orderEvent.totalAmount,
        currency: orderEvent.currency,
        reference: `ORDER-${orderEvent.orderId}`
      });

      // Step 4: Publish payment created event
      await kafkaProducer.sendMessage(TOPICS.PAYMENT_CREATED, {
        eventType: 'PAYMENT_CREATED',
        paymentId: paymentId,
        orderId: orderEvent.orderId,
        customerId: orderEvent.customerId,
        customerEmail: orderEvent.customerEmail,
        amount: orderEvent.totalAmount,
        currency: orderEvent.currency,
        versaPayCustomerId: customer.id,
        versaPayInvoiceId: invoice.id,
        versaPayTransactionId: gatewayTransaction.id,
        paymentUrl: gatewayTransaction.payment_url || gatewayTransaction.url,
        status: 'pending',
        timestamp: new Date().toISOString()
      });

      console.log(`Payment ${paymentId} created successfully with VersaPay transaction ${gatewayTransaction.id}`);
      
    } catch (error) {
      console.error(`Payment processing failed for order ${orderEvent.orderId}:`, error);
      
      // Publish payment failure event
      await kafkaProducer.sendMessage(TOPICS.NOTIFICATION_SEND, {
        eventType: 'PAYMENT_FAILED',
        orderId: orderEvent.orderId,
        customerId: orderEvent.customerId,
        customerEmail: orderEvent.customerEmail,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  async handlePaymentCompletion(paymentData) {
    try {
      console.log(`Payment completed: ${paymentData.paymentId}`);
      
      // Verify payment with VersaPay
      const transactionStatus = await this.versapay.getTransactionStatus(paymentData.versaPayTransactionId);
      
      if (transactionStatus.status === 'completed' || transactionStatus.status === 'paid') {
        // Publish payment completed event
        await kafkaProducer.sendMessage(TOPICS.PAYMENT_COMPLETED, {
          eventType: 'PAYMENT_COMPLETED',
          paymentId: paymentData.paymentId,
          orderId: paymentData.orderId,
          customerId: paymentData.customerId,
          customerEmail: paymentData.customerEmail,
          amount: paymentData.amount,
          currency: paymentData.currency,
          transactionId: transactionStatus.id,
          status: 'completed',
          timestamp: new Date().toISOString()
        });
        
        console.log(`Payment ${paymentData.paymentId} confirmed and completed`);
      } else {
        console.log(`Payment ${paymentData.paymentId} status: ${transactionStatus.status}`);
      }
    } catch (error) {
      console.error('Error handling payment completion:', error);
    }
  }

  async stop() {
    if (!this.isRunning) {
      return;
    }

    try {
      await consumer.disconnect();
      this.isRunning = false;
      console.log('Payment Service stopped');
    } catch (error) {
      console.error('Error stopping Payment Service:', error);
    }
  }
}

module.exports = PaymentService;
