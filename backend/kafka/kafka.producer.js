const { kafka } = require('./kafka.config');

class KafkaProducer {
    constructor() {
        this.producer = kafka.producer({
            maxInFlightRequests: 1,
            idempotent: true,
            transactionTimeout: 30000
        });
        this.isConnected = false;
    }

    async connect() {
        if (!this.isConnected) {
            try {
                await this.producer.connect();
                this.isConnected = true;
                console.log('Kafka Producer connected successfully');
            } catch (error) {
                console.error('Failed to connect Kafka Producer:', error);
                throw error;
            }
        }
    }

    async disconnect() {
        if (this.isConnected) {
            try {
                await this.producer.disconnect();
                this.isConnected = false;
                console.log('Kafka Producer disconnected');
            } catch (error) {
                console.error('Error disconnecting Kafka Producer:', error);
            }
        }
    }

    async publish(topic, message, options = {}) {
        try {
            // Ensure producer is connected
            if (!this.isConnected) {
                await this.connect();
            }

            // Prepare message
            const messageToSend = {
                topic,
                messages: [{
                    key: options.key || message.orderId || message.customerId || Date.now().toString(),
                    value: JSON.stringify(message),
                    timestamp: options.timestamp || Date.now(),
                    headers: options.headers || {}
                }]
            };

            // Send message
            const result = await this.producer.send(messageToSend);
            
            console.log(`Message published to topic ${topic}:`, {
                topic,
                partition: result[0].partition,
                offset: result[0].offset,
                messageId: messageToSend.messages[0].key
            });

            return result;
        } catch (error) {
            console.error(`Failed to publish message to topic ${topic}:`, error);
            throw error;
        }
    }

    async publishBatch(topic, messages, options = {}) {
        try {
            if (!this.isConnected) {
                await this.connect();
            }

            const messagesToSend = {
                topic,
                messages: messages.map((message, index) => ({
                    key: options.key || message.orderId || message.customerId || `${Date.now()}-${index}`,
                    value: JSON.stringify(message),
                    timestamp: options.timestamp || Date.now(),
                    headers: options.headers || {}
                }))
            };

            const result = await this.producer.send(messagesToSend);
            
            console.log(`Batch of ${messages.length} messages published to topic ${topic}`);
            return result;
        } catch (error) {
            console.error(`Failed to publish batch to topic ${topic}:`, error);
            throw error;
        }
    }

    // Graceful shutdown
    async shutdown() {
        console.log('Shutting down Kafka Producer...');
        await this.disconnect();
    }
}

// Create singleton instance
const kafkaProducer = new KafkaProducer();

// Graceful shutdown handling
process.on('SIGINT', async () => {
    await kafkaProducer.shutdown();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await kafkaProducer.shutdown();
    process.exit(0);
});

module.exports = kafkaProducer;
