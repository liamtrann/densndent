const { producer } = require('./kafka.config');

class KafkaProducer {
    constructor() {
        this.isConnected = false;
    }

    async connect() {
        if (!this.isConnected) {
            await producer.connect();
            this.isConnected = true;
            console.log('Kafka Producer connected');
        }
    }

    async disconnect() {
        if (this.isConnected) {
            await producer.disconnect();
            this.isConnected = false;
            console.log('Kafka Producer disconnected');
        }
    }

    async sendMessage(topic, message) {
        try {
            await this.connect();

            const result = await producer.send({
                topic,
                messages: [
                    {
                        key: message.id || Date.now().toString(),
                        value: JSON.stringify(message),
                        timestamp: Date.now().toString()
                    }
                ]
            });

            console.log(`Message sent to topic ${topic}:`, message.id || 'no-id');
            return result;
        } catch (error) {
            console.error('Error sending message to Kafka:', error);
            throw error;
        }
    }
}

module.exports = new KafkaProducer();
