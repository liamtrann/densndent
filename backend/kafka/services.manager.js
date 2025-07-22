const PaymentService = require('./payment.service');
const FulfillmentService = require('./fulfillment.service');
const NotificationService = require('./notification.service');
const kafkaProducer = require('./kafka.producer');

class KafkaServicesManager {
  constructor() {
    this.paymentService = new PaymentService();
    this.fulfillmentService = new FulfillmentService();
    this.notificationService = new NotificationService();
    this.isRunning = false;
  }

  async startAllServices() {
    if (this.isRunning) {
      console.log('Kafka services are already running');
      return;
    }

    try {
      console.log('🚀 Starting Kafka microservices...');

      // Connect Kafka producer
      await kafkaProducer.connect();
      console.log('✅ Kafka Producer connected');

      // Start all microservices
      await Promise.all([
        this.paymentService.start(),
        this.fulfillmentService.start(),
        this.notificationService.start()
      ]);

      this.isRunning = true;
      console.log('🎉 All Kafka microservices started successfully!');

      // Log service status
      this.logServiceStatus();

    } catch (error) {
      console.error('❌ Error starting Kafka services:', error);
      await this.stopAllServices();
      throw error;
    }
  }

  async stopAllServices() {
    if (!this.isRunning) {
      return;
    }

    try {
      console.log('🛑 Stopping Kafka microservices...');

      // Stop all services
      await Promise.all([
        this.paymentService.stop(),
        this.fulfillmentService.stop(),
        this.notificationService.stop()
      ]);

      // Disconnect producer
      await kafkaProducer.disconnect();

      this.isRunning = false;
      console.log('✅ All Kafka services stopped successfully');

    } catch (error) {
      console.error('❌ Error stopping Kafka services:', error);
    }
  }

  logServiceStatus() {
    console.log('\n📊 Kafka Services Status:');
    console.log('┌─────────────────────┬──────────┐');
    console.log('│ Service             │ Status   │');
    console.log('├─────────────────────┼──────────┤');
    console.log('│ Payment Service     │ Running  │');
    console.log('│ Fulfillment Service │ Running  │');
    console.log('│ Notification Service│ Running  │');
    console.log('│ Kafka Producer      │ Running  │');
    console.log('└─────────────────────┴──────────┘\n');
  }

  // Health check method
  getServicesHealth() {
    return {
      isRunning: this.isRunning,
      services: {
        payment: this.paymentService.isRunning,
        fulfillment: this.fulfillmentService.isRunning,
        notification: this.notificationService.isRunning,
        producer: kafkaProducer.isConnected
      },
      timestamp: new Date().toISOString()
    };
  }
}

// Handle graceful shutdown
let servicesManager = null;

process.on('SIGTERM', async () => {
  console.log('🔄 Received SIGTERM, shutting down gracefully...');
  if (servicesManager) {
    await servicesManager.stopAllServices();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 Received SIGINT, shutting down gracefully...');
  if (servicesManager) {
    await servicesManager.stopAllServices();
  }
  process.exit(0);
});

// Export singleton instance
if (!servicesManager) {
  servicesManager = new KafkaServicesManager();
}

module.exports = servicesManager;
