// order.controller.js
// Controller for order endpoints

const restApiService = require('../restapi.service');
const kafkaProducer = require('../../kafka/kafka.producer');
const TOPICS = require('../../kafka/topics');

// Create a new sales order
const createSalesOrder = async (req, res, next) => {
    try {
        // Create the order in NetSuite
        const result = await restApiService.postRecord('salesOrder', req.body);

        // Publish order created event to Kafka
        const orderEvent = {
            eventType: 'ORDER_CREATED',
            orderId: result.id,
            customerId: req.body.entity?.id,
            orderData: result,
            timestamp: new Date().toISOString()
        };

        await kafkaProducer.publish(TOPICS.ORDER_CREATED, orderEvent);
        console.log(`Order created event published for order: ${result.id}`);

        res.status(201).json(result);
    } catch (err) {
        console.error('Error creating sales order:', err);
        next(err);
    }
};

// Get a specific sales order by ID
const getSalesOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await restApiService.getRecord('salesOrder', id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// Update sales order
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await restApiService.patchRecord('salesOrder', id, req.body);

        // Publish order updated event to Kafka if status changed
        if (req.body.status) {
            const orderEvent = {
                eventType: 'ORDER_STATUS_UPDATED',
                orderId: id,
                newStatus: req.body.status,
                orderData: result,
                timestamp: new Date().toISOString()
            };

            await kafkaProducer.publish(TOPICS.ORDER_UPDATED, orderEvent);
            console.log(`Order status updated event published for order: ${id}`);
        }

        res.json(result);
    } catch (err) {
        console.error('Error updating sales order:', err);
        next(err);
    }
};

module.exports = {
    createSalesOrder,
    getSalesOrder,
    updateOrderStatus
};
