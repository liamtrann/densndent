// kafka.producer.js
// Kafka producer for publishing messages

const kafka = require('kafkajs');

// Create Kafka client
const kafkaClient = kafka({
    clientId: 'densndent-backend',
    brokers: [process.env.KAFKA_BROKER_URL || 'localhost:9092'],
    // Add authentication if needed
    // ssl: true,
    // sasl: {
    //     mechanism: 'plain',
    //     username: process.env.KAFKA_USERNAME,
    //     password: process.env.KAFKA_PASSWORD
    // }
});

const producer = kafkaClient.producer({
    maxInFlightRequests: 1,
    idempotent: true,
    transactionTimeout: 30000,
});

let isConnected = false;

// Connect to Kafka
const connect = async () => {
    if (!isConnected) {
        try {
            await producer.connect();
            isConnected = true;
            console.log('Kafka producer connected successfully');
        } catch (error) {
            console.error('Failed to connect Kafka producer:', error);
            throw error;
        }
    }
};

// Disconnect from Kafka
const disconnect = async () => {
    if (isConnected) {
        try {
            await producer.disconnect();
            isConnected = false;
            console.log('Kafka producer disconnected');
        } catch (error) {
            console.error('Error disconnecting Kafka producer:', error);
        }
    }
};

// Send message to Kafka topic
const sendMessage = async (topic, message) => {
    try {
        await connect();

        const result = await producer.send({
            topic,
            messages: [{
                key: message.orderId || message.transactionId || message.customerId,
                value: JSON.stringify(message),
                timestamp: Date.now().toString()
            }]
        });

        console.log(`Message sent to topic ${topic}:`, result);
        return result;
    } catch (error) {
        console.error(`Error sending message to topic ${topic}:`, error);
        throw error;
    }
};

// Send multiple messages to Kafka topic
const sendMessages = async (topic, messages) => {
    try {
        await connect();

        const kafkaMessages = messages.map(message => ({
            key: message.orderId || message.transactionId || message.customerId,
            value: JSON.stringify(message),
            timestamp: Date.now().toString()
        }));

        const result = await producer.send({
            topic,
            messages: kafkaMessages
        });

        console.log(`${messages.length} messages sent to topic ${topic}:`, result);
        return result;
    } catch (error) {
        console.error(`Error sending messages to topic ${topic}:`, error);
        throw error;
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down Kafka producer...');
    await disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Shutting down Kafka producer...');
    await disconnect();
    process.exit(0);
});

module.exports = {
    connect,
    disconnect,
    sendMessage,
    sendMessages
};
