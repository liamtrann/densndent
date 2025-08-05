const { Kafka } = require('kafkajs');

// Kafka configuration
const kafka = new Kafka({
    clientId: 'densndent-api',
    brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    connectionTimeout: 3000,
    requestTimeout: 30000,
    retry: {
        initialRetryTime: 100,
        retries: 8
    }
});

module.exports = { kafka };
