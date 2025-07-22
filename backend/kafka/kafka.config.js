const { Kafka } = require('kafkajs');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'densndent-ecommerce-app',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

const producer = kafka.producer({
  maxInFlightRequests: 1,
  idempotent: true,
  transactionTimeout: 30000,
});

const consumer = kafka.consumer({ 
  groupId: 'payment-processing-group',
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
});

module.exports = {
  kafka,
  producer,
  consumer
};
